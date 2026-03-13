const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const GOOGLE_API_KEY = Deno.env.get('GOOGLE_API_KEY')!;
const ROOT_FOLDER_ID = '1D60NzFn3fDfEcAGUa1OkbzZnq4RoH4xR';

interface IndexedFolder {
  id: string;
  name: string;
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

// Build a full index of ALL folder names + IDs (BFS)
async function buildFolderIndex(rootId: string): Promise<IndexedFolder[]> {
  const allFolders: IndexedFolder[] = [];
  const queue: string[] = [rootId];

  while (queue.length > 0) {
    // Process up to 5 parent folders in parallel
    const batch = queue.splice(0, 5);
    const promises = batch.map(async (parentId) => {
      let pageToken = '';
      const folders: IndexedFolder[] = [];
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
    });

    const results = await Promise.all(promises);
    for (const folders of results) {
      allFolders.push(...folders);
      queue.push(...folders.map(f => f.id));
    }

    if (allFolders.length > 2000) break; // safety
  }

  return allFolders;
}

// List files inside specific folders
async function listFilesInFolders(folderIds: string[]): Promise<DriveFile[]> {
  const allFiles: DriveFile[] = [];
  
  // Process in parallel batches of 5
  for (let i = 0; i < folderIds.length; i += 5) {
    const batch = folderIds.slice(i, i + 5);
    const promises = batch.map(async (folderId) => {
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
    });
    const results = await Promise.all(promises);
    for (const files of results) {
      allFiles.push(...files);
    }
  }

  return allFiles;
}

// Cache
let folderIndex: IndexedFolder[] | null = null;
let indexTimestamp = 0;
const INDEX_TTL = 15 * 60 * 1000; // 15 minutes

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
      folderIndex = await buildFolderIndex(ROOT_FOLDER_ID);
      indexTimestamp = Date.now();
      console.log(`Indexed ${folderIndex.length} folders`);
    }

    const q = query.trim().toLowerCase();
    
    // Search folder names in memory
    const matchedFolders = folderIndex.filter(f => 
      f.name.toLowerCase().includes(q)
    ).slice(0, 20);

    // For matched folders, list their files
    const matchedFolderIds = matchedFolders.map(f => f.id);
    let matchedFiles: DriveFile[] = [];
    
    if (matchedFolderIds.length > 0 && matchedFolderIds.length <= 10) {
      matchedFiles = await listFilesInFolders(matchedFolderIds);
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
