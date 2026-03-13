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

// List all items in a folder (single level)
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

// Normalize string for accent-insensitive matching
function normalize(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

// Check if item name matches query (supports partial, accent-insensitive)
function nameMatches(name: string, queryTerms: string[]): boolean {
  const normalized = normalize(name);
  return queryTerms.every(term => normalized.includes(term));
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

    const matchedFolders: { id: string; name: string }[] = [];
    const matchedFiles: DriveItem[] = [];
    const MAX_RESULTS = 60;

    // Phase 1: List root-level folders
    const rootItems = await listFolder(ROOT_FOLDER_ID);
    const rootFolders = rootItems.filter(i => i.mimeType === 'application/vnd.google-apps.folder');
    const rootFiles = rootItems.filter(i => i.mimeType !== 'application/vnd.google-apps.folder');

    // Check root-level files
    for (const f of rootFiles) {
      if (nameMatches(f.name, queryTerms)) matchedFiles.push(f);
    }

    // Check root-level folders
    for (const f of rootFolders) {
      if (nameMatches(f.name, queryTerms)) {
        matchedFolders.push({ id: f.id, name: f.name });
      }
    }

    // Phase 2: Search inside each root subfolder (level 2) - parallel
    const level2Results = await Promise.all(
      rootFolders.map(async (folder) => {
        try {
          const items = await listFolder(folder.id);
          const subFolders = items.filter(i => i.mimeType === 'application/vnd.google-apps.folder');
          const subFiles = items.filter(i => i.mimeType !== 'application/vnd.google-apps.folder');
          return { subFolders, subFiles, parentName: folder.name };
        } catch {
          return { subFolders: [], subFiles: [], parentName: folder.name };
        }
      })
    );

    // Collect level 2 matches and gather level 3 folder IDs
    const level3Folders: DriveItem[] = [];
    for (const { subFolders, subFiles } of level2Results) {
      for (const f of subFiles) {
        if (nameMatches(f.name, queryTerms) && matchedFiles.length < MAX_RESULTS) {
          matchedFiles.push(f);
        }
      }
      for (const f of subFolders) {
        if (nameMatches(f.name, queryTerms) && matchedFolders.length < 30) {
          matchedFolders.push({ id: f.id, name: f.name });
        }
        level3Folders.push(f);
      }
    }

    // Phase 3: Search inside level 3 folders (deepest common level: artist folders) - parallel with concurrency limit
    const CONCURRENCY = 10;
    for (let i = 0; i < level3Folders.length && matchedFiles.length < MAX_RESULTS; i += CONCURRENCY) {
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
          if (item.mimeType === 'application/vnd.google-apps.folder') {
            if (nameMatches(item.name, queryTerms) && matchedFolders.length < 30) {
              matchedFolders.push({ id: item.id, name: item.name });
            }
          } else {
            if (nameMatches(item.name, queryTerms) && matchedFiles.length < MAX_RESULTS) {
              matchedFiles.push(item);
            }
          }
        }
      }
    }

    console.log(`Search "${q}": ${matchedFolders.length} folders, ${matchedFiles.length} files (scanned ${level3Folders.length} deep folders)`);

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