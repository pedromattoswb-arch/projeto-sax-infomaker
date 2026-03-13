const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const GOOGLE_API_KEY = Deno.env.get('GOOGLE_API_KEY')!;

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

async function searchFiles(query: string, pageSize = 50): Promise<DriveFile[]> {
  // Escape single quotes in query
  const escaped = query.replace(/'/g, "\\'");
  
  // Search by name across all files accessible by this API key
  const params = new URLSearchParams({
    q: `name contains '${escaped}' and trashed = false`,
    key: GOOGLE_API_KEY,
    fields: 'nextPageToken, files(id, name, mimeType, size, parents)',
    pageSize: String(pageSize),
    orderBy: 'name',
  });

  const res = await fetch(`https://www.googleapis.com/drive/v3/files?${params}`);
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Google Drive API error: ${res.status} - ${err}`);
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
      return new Response(JSON.stringify({ results: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const items = await searchFiles(query.trim());

    const folders = items
      .filter(f => f.mimeType === 'application/vnd.google-apps.folder')
      .map(f => ({
        id: f.id,
        name: f.name,
        type: 'folder' as const,
      }));

    const files = items
      .filter(f => f.mimeType !== 'application/vnd.google-apps.folder')
      .map(f => {
        const isPdf = f.mimeType === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf');
        const isAudio = f.mimeType?.startsWith('audio/') || /\.(mp3|wav|ogg|m4a)$/i.test(f.name);

        let fileType = 'other';
        if (isPdf) fileType = 'pdf';
        else if (isAudio) fileType = 'audio';

        const projectRef = Deno.env.get('SUPABASE_PROJECT_REF') || 'yjvupzfstxywdmdkwhlr';
        
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
