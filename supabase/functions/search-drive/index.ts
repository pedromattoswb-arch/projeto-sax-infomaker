const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const GOOGLE_API_KEY = Deno.env.get('GOOGLE_API_KEY')!;
const ROOT_FOLDER_ID = '1D60NzFn3fDfEcAGUa1OkbzZnq4RoH4xR';

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

// Collect all subfolder IDs recursively (BFS)
async function getAllFolderIds(rootId: string): Promise<string[]> {
  const allIds: string[] = [rootId];
  const queue: string[] = [rootId];

  while (queue.length > 0) {
    const batch = queue.splice(0, 5); // process 5 at a time
    const promises = batch.map(async (parentId) => {
      const params = new URLSearchParams({
        q: `'${parentId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
        key: GOOGLE_API_KEY,
        fields: 'files(id)',
        pageSize: '1000',
      });
      const res = await fetch(`https://www.googleapis.com/drive/v3/files?${params}`);
      if (!res.ok) return [];
      const data: DriveListResponse = await res.json();
      return (data.files || []).map(f => f.id);
    });

    const results = await Promise.all(promises);
    for (const ids of results) {
      allIds.push(...ids);
      queue.push(...ids);
    }

    // Safety limit: max ~500 folders deep
    if (allIds.length > 500) break;
  }

  return allIds;
}

// Search files by name within specific parent folders
async function searchInFolders(query: string, folderIds: string[]): Promise<DriveFile[]> {
  const escaped = query.replace(/'/g, "\\'");
  const allFiles: DriveFile[] = [];

  // Search in batches of parent folders (Drive API supports OR in queries)
  // But safer: just do a global name search and filter
  // Actually, let's search with name contains across all accessible files
  const params = new URLSearchParams({
    q: `name contains '${escaped}' and trashed = false`,
    key: GOOGLE_API_KEY,
    fields: 'files(id, name, mimeType, size)',
    pageSize: '50',
    orderBy: 'name',
  });

  const res = await fetch(`https://www.googleapis.com/drive/v3/files?${params}`);
  if (!res.ok) {
    // If global search fails, try folder-by-folder approach
    return await searchFolderByFolder(query, folderIds);
  }

  const data: DriveListResponse = await res.json();
  return data.files || [];
}

// Fallback: search within specific folders
async function searchFolderByFolder(query: string, folderIds: string[]): Promise<DriveFile[]> {
  const escaped = query.replace(/'/g, "\\'");
  const allFiles: DriveFile[] = [];
  
  // Search in batches of 10 folders at a time using OR
  for (let i = 0; i < folderIds.length && allFiles.length < 50; i += 10) {
    const batch = folderIds.slice(i, i + 10);
    const parentQueries = batch.map(id => `'${id}' in parents`).join(' or ');
    
    const params = new URLSearchParams({
      q: `(${parentQueries}) and name contains '${escaped}' and trashed = false`,
      key: GOOGLE_API_KEY,
      fields: 'files(id, name, mimeType, size)',
      pageSize: '20',
      orderBy: 'name',
    });

    try {
      const res = await fetch(`https://www.googleapis.com/drive/v3/files?${params}`);
      if (res.ok) {
        const data: DriveListResponse = await res.json();
        allFiles.push(...(data.files || []));
      }
    } catch {
      // Skip this batch on error
    }
  }

  return allFiles;
}

// Simple cache for folder IDs (expensive to compute)
let cachedFolderIds: string[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

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

    // Get all folder IDs (cached)
    if (!cachedFolderIds || Date.now() - cacheTimestamp > CACHE_TTL) {
      console.log('Building folder index...');
      cachedFolderIds = await getAllFolderIds(ROOT_FOLDER_ID);
      cacheTimestamp = Date.now();
      console.log(`Indexed ${cachedFolderIds.length} folders`);
    }

    const items = await searchFolderByFolder(query.trim(), cachedFolderIds);

    const folders = items
      .filter(f => f.mimeType === 'application/vnd.google-apps.folder')
      .map(f => ({
        id: f.id,
        name: f.name,
        type: 'folder' as const,
      }));

    const projectRef = Deno.env.get('SUPABASE_PROJECT_REF') || 'yjvupzfstxywdmdkwhlr';

    const files = items
      .filter(f => f.mimeType !== 'application/vnd.google-apps.folder')
      .map(f => {
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
