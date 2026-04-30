const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const GOOGLE_API_KEY = Deno.env.get('GOOGLE_API_KEY')!;
const ROOT_FOLDER_ID = '1D60NzFn3fDfEcAGUa1OkbzZnq4RoH4xR';

interface DriveItem {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
}

interface DriveListResponse {
  files: DriveItem[];
  nextPageToken?: string;
}

// ── Full index cache ──
interface IndexEntry {
  id: string;
  name: string;
  nameNorm: string; // pre-normalized for search
  mimeType: string;
  size?: string;
  isFolder: boolean;
}

let indexCache: IndexEntry[] | null = null;
let indexBuiltAt = 0;
let indexBuildPromise: Promise<IndexEntry[]> | null = null;
const INDEX_TTL = 15 * 60 * 1000; // 15 minutes

function normalize(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

async function listFolder(folderId: string): Promise<DriveItem[]> {
  const allItems: DriveItem[] = [];
  let pageToken = '';

  do {
    const params = new URLSearchParams({
      q: `'${folderId}' in parents and trashed = false`,
      key: GOOGLE_API_KEY,
      fields: 'nextPageToken, files(id, name, mimeType, size)',
      pageSize: '1000',
      orderBy: 'name',
    });
    if (pageToken) params.set('pageToken', pageToken);

    const res = await fetch(`https://www.googleapis.com/drive/v3/files?${params}`);
    if (!res.ok) break;
    const data: DriveListResponse = await res.json();
    allItems.push(...(data.files || []));
    pageToken = data.nextPageToken || '';
  } while (pageToken);

  return allItems;
}

async function buildIndex(): Promise<IndexEntry[]> {
  const entries: IndexEntry[] = [];

  // Level 1: root
  const rootItems = await listFolder(ROOT_FOLDER_ID);
  const rootFolders: DriveItem[] = [];

  for (const item of rootItems) {
    const isFolder = item.mimeType === 'application/vnd.google-apps.folder';
    entries.push({
      id: item.id,
      name: item.name,
      nameNorm: normalize(item.name),
      mimeType: item.mimeType,
      size: item.size,
      isFolder,
    });
    if (isFolder) rootFolders.push(item);
  }

  // Level 2: parallel scan of all root subfolders
  const level2Results = await Promise.all(
    rootFolders.map(async (folder) => {
      try {
        return { items: await listFolder(folder.id), parentId: folder.id };
      } catch {
        return { items: [], parentId: folder.id };
      }
    })
  );

  const level3Folders: DriveItem[] = [];

  for (const { items } of level2Results) {
    for (const item of items) {
      const isFolder = item.mimeType === 'application/vnd.google-apps.folder';
      entries.push({
        id: item.id,
        name: item.name,
        nameNorm: normalize(item.name),
        mimeType: item.mimeType,
        size: item.size,
        isFolder,
      });
      if (isFolder) level3Folders.push(item);
    }
  }

  // Level 3: parallel with concurrency limit
  const CONCURRENCY = 15;
  for (let i = 0; i < level3Folders.length; i += CONCURRENCY) {
    const batch = level3Folders.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(
      batch.map(async (folder) => {
        try {
          return await listFolder(folder.id);
        } catch {
          return [];
        }
      })
    );

    for (const items of batchResults) {
      for (const item of items) {
        entries.push({
          id: item.id,
          name: item.name,
          nameNorm: normalize(item.name),
          mimeType: item.mimeType,
          size: item.size,
          isFolder: item.mimeType === 'application/vnd.google-apps.folder',
        });
      }
    }
  }

  console.log(`Index built: ${entries.length} entries (${level3Folders.length} deep folders scanned)`);
  return entries;
}

async function getIndex(): Promise<IndexEntry[]> {
  // Return cached if fresh
  if (indexCache && Date.now() - indexBuiltAt < INDEX_TTL) {
    return indexCache;
  }

  // If already building, wait for it
  if (indexBuildPromise) {
    return indexBuildPromise;
  }

  // Build new index
  indexBuildPromise = buildIndex().then((entries) => {
    indexCache = entries;
    indexBuiltAt = Date.now();
    indexBuildPromise = null;
    return entries;
  }).catch((err) => {
    indexBuildPromise = null;
    throw err;
  });

  return indexBuildPromise;
}

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

    const q = query.trim();
    const queryTerms = normalize(q).split(/\s+/).filter(Boolean);

    const index = await getIndex();

    // Filter in memory — instant
    const matchedFolders: IndexEntry[] = [];
    const matchedFiles: IndexEntry[] = [];
    const MAX_FOLDERS = 30;
    const MAX_FILES = 60;

    for (const entry of index) {
      if (matchedFolders.length >= MAX_FOLDERS && matchedFiles.length >= MAX_FILES) break;

      const matches = queryTerms.every(term => entry.nameNorm.includes(term));
      if (!matches) continue;

      if (entry.isFolder && matchedFolders.length < MAX_FOLDERS) {
        matchedFolders.push(entry);
      } else if (!entry.isFolder && matchedFiles.length < MAX_FILES) {
        matchedFiles.push(entry);
      }
    }

    console.log(`Search "${q}": ${matchedFolders.length} folders, ${matchedFiles.length} files (index: ${index.length} entries)`);

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
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error('Search error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
