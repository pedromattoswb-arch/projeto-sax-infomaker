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
  parents?: string[];
}

interface DriveListResponse {
  files: DriveFile[];
  nextPageToken?: string;
}

// Search files by name across the entire Drive folder using Google's native search
async function searchFilesByName(query: string): Promise<DriveFile[]> {
  const allFiles: DriveFile[] = [];
  let pageToken = '';
  
  // Use fullText search which searches file names and content
  // Also restrict to files under our root by using corpora=allDrives or just searching broadly
  const escapedQuery = query.replace(/'/g, "\\'");
  
  do {
    const params = new URLSearchParams({
      q: `name contains '${escapedQuery}' and trashed = false and '${ROOT_FOLDER_ID}' in parents or name contains '${escapedQuery}' and trashed = false`,
      key: GOOGLE_API_KEY,
      fields: 'nextPageToken, files(id, name, mimeType, size, parents)',
      pageSize: '100',
      orderBy: 'name',
    });
    if (pageToken) params.set('pageToken', pageToken);

    const res = await fetch(`https://www.googleapis.com/drive/v3/files?${params}`);
    if (!res.ok) {
      console.error('Search API error:', await res.text());
      break;
    }
    const data: DriveListResponse = await res.json();
    allFiles.push(...(data.files || []));
    pageToken = data.nextPageToken || '';
    
    // Limit to avoid timeout
    if (allFiles.length >= 200) break;
  } while (pageToken);

  return allFiles;
}

// Search folders by name
async function searchFoldersByName(query: string): Promise<DriveFile[]> {
  const escapedQuery = query.replace(/'/g, "\\'");
  const params = new URLSearchParams({
    q: `name contains '${escapedQuery}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    key: GOOGLE_API_KEY,
    fields: 'files(id, name, mimeType)',
    pageSize: '50',
    orderBy: 'name',
  });

  const res = await fetch(`https://www.googleapis.com/drive/v3/files?${params}`);
  if (!res.ok) return [];
  const data: DriveListResponse = await res.json();
  return data.files || [];
}

// Search non-folder files by name
async function searchNonFolderFilesByName(query: string): Promise<DriveFile[]> {
  const escapedQuery = query.replace(/'/g, "\\'");
  const params = new URLSearchParams({
    q: `name contains '${escapedQuery}' and mimeType != 'application/vnd.google-apps.folder' and trashed = false`,
    key: GOOGLE_API_KEY,
    fields: 'files(id, name, mimeType, size)',
    pageSize: '100',
    orderBy: 'name',
  });

  const res = await fetch(`https://www.googleapis.com/drive/v3/files?${params}`);
  if (!res.ok) {
    console.error('File search error:', await res.text());
    return [];
  }
  const data: DriveListResponse = await res.json();
  return data.files || [];
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

    // Search folders and files in parallel using Google Drive native search
    const [foundFolders, foundFiles] = await Promise.all([
      searchFoldersByName(q),
      searchNonFolderFilesByName(q),
    ]);

    console.log(`Search "${q}": ${foundFolders.length} folders, ${foundFiles.length} files`);

    const projectRef = Deno.env.get('SUPABASE_PROJECT_REF') || 'yjvupzfstxywdmdkwhlr';

    const folders = foundFolders.slice(0, 20).map(f => ({
      id: f.id,
      name: f.name,
      type: 'folder' as const,
    }));

    const files = foundFiles.slice(0, 50).map(f => {
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
