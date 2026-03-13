const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const GOOGLE_API_KEY = Deno.env.get('GOOGLE_API_KEY')!;
const ROOT_FOLDER_ID = '1D60NzFn3fDfEcAGUa1OkbzZnq4RoH4xR';

interface IndexedFolder {
  id: string;
  name: string;
  depth: number;
}

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
}

interface DriveListResponse {
  files: DriveFile[];
  nextPageToken?: string;
}

async function listSubfolders(parentId: string): Promise<{ id: string; name: string }[]> {
  const folders: { id: string; name: string }[] = [];
  let pageToken = '';
  do {
    const params = new URLSearchParams({
      q: `'${parentId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
      key: GOOGLE_API_KEY,
      fields: 'nextPageToken, files(id, name)',
      pageSize: '1000',
    });
    if (pageToken) params.set('pageToken', pageToken);
    const res = await fetch(`https://www.googleapis.com/drive/v3/files?${params}`);
    if (!res.ok) break;
    const data: DriveListResponse = await res.json();
    for (const f of (data.files || [])) {
      folders.push({ id: f.id, name: f.name });
    }
    pageToken = data.nextPageToken || '';
  } while (pageToken);
  return folders;
}

// Index only 3 levels: root → categories → artists → songs/albums
async function buildIndex(rootId: string): Promise<IndexedFolder[]> {
  const all: IndexedFolder[] = [];

  // Level 1: categories
  const categories = await listSubfolders(rootId);
  for (const cat of categories) {
    all.push({ id: cat.id, name: cat.name, depth: 1 });
  }

  // Level 2: artists (parallel, 5 at a time)
  for (let i = 0; i < categories.length; i += 5) {
    const batch = categories.slice(i, i + 5);
    const results = await Promise.all(batch.map(cat => listSubfolders(cat.id)));
    for (const artists of results) {
      for (const a of artists) {
        all.push({ id: a.id, name: a.name, depth: 2 });
      }
    }
  }

  // Level 3: songs/albums inside each artist (parallel, 10 at a time)
  const level2 = all.filter(f => f.depth === 2);
  for (let i = 0; i < level2.length; i += 10) {
    const batch = level2.slice(i, i + 10);
    const results = await Promise.all(batch.map(f => listSubfolders(f.id)));
    for (const songs of results) {
      for (const s of songs) {
        all.push({ id: s.id, name: s.name, depth: 3 });
      }
    }
  }

  return all;
}

async function listFilesInFolder(folderId: string): Promise<DriveFile[]> {
  const params = new URLSearchParams({
    q: `'${folderId}' in parents and mimeType != 'application/vnd.google-apps.folder' and trashed = false`,
    key: GOOGLE_API_KEY,
    fields: 'files(id, name, mimeType, size)',
    pageSize: '100',
  });
  try {
    const res = await fetch(`https://www.googleapis.com/drive/v3/files?${params}`);
    if (!res.ok) return [];
    const data: DriveListResponse = await res.json();
    return data.files || [];
  } catch {
    return [];
  }
}

// Cache
let folderIndex: IndexedFolder[] | null = null;
let indexTimestamp = 0;
const INDEX_TTL = 30 * 60 * 1000; // 30 minutes

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const query = url.searchParams.get('q');

    if (!query || query.trim().length < 2) {
      return new Response(JSON.stringify({ folders: [], files: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Build or use cached folder index
    if (!folderIndex || Date.now() - indexTimestamp > INDEX_TTL) {
      console.log('Building folder index...');
      folderIndex = await buildIndex(ROOT_FOLDER_ID);
      indexTimestamp = Date.now();
      console.log(`Indexed ${folderIndex.length} folders`);
    }

    const q = query.trim().toLowerCase();

    // Search folder names in memory (prioritize deeper folders = more specific)
    const matchedFolders = folderIndex
      .filter(f => f.name.toLowerCase().includes(q))
      .sort((a, b) => b.depth - a.depth) // deeper matches first
      .slice(0, 15);

    // For the top matched folders, list their files
    const foldersToFetch = matchedFolders.slice(0, 5);
    let matchedFiles: DriveFile[] = [];

    if (foldersToFetch.length > 0) {
      const results = await Promise.all(foldersToFetch.map(f => listFilesInFolder(f.id)));
      for (const files of results) {
        matchedFiles.push(...files);
      }
    }

    // Format response
    const projectRef = Deno.env.get('SUPABASE_PROJECT_REF') || 'yjvupzfstxywdmdkwhlr';

    const folders = matchedFolders.map(f => ({
      id: f.id,
      name: f.name,
      type: 'folder' as const,
    }));

    const files = matchedFiles.map(f => {
      const isPdf = f.mimeType === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf');
      const isAudio = f.mimeType?.startsWith('audio/') || /\.(mp3|wav|ogg|m4a)$/i.test(f.name);

      let fileType = 'other';
      if (isPdf) fileType = 'pdf';
      else if (isAudio) fileType = 'audio';

      return {
        id: f.id,
        name: f.name,
        type: fileType,
        mimeType: f.mimeType,
        size: f.size ? parseInt(f.size) : null,
        viewUrl: isPdf ? `https://drive.google.com/file/d/${f.id}/preview` : null,
        downloadUrl: `https://${projectRef}.supabase.co/functions/v1/download-file?id=${f.id}`,
        streamUrl: isAudio ? `https://${projectRef}.supabase.co/functions/v1/stream-audio?id=${f.id}` : null,
        thumbnailUrl: null,
      };
    });

    return new Response(JSON.stringify({ folders, files }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Search error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
