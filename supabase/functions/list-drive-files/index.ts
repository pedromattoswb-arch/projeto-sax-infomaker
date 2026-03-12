const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GOOGLE_API_KEY = Deno.env.get('GOOGLE_API_KEY')!;
const ROOT_FOLDER_ID = '1D60NzFn3fDfEcAGUa1OkbzZnq4RoH4xR';

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  webContentLink?: string;
  size?: string;
}

interface DriveListResponse {
  files: DriveFile[];
  nextPageToken?: string;
}

async function listFilesInFolder(folderId: string): Promise<DriveFile[]> {
  const allFiles: DriveFile[] = [];
  let pageToken = '';

  do {
    const params = new URLSearchParams({
      q: `'${folderId}' in parents and trashed = false`,
      key: GOOGLE_API_KEY,
      fields: 'nextPageToken, files(id, name, mimeType, webViewLink, webContentLink, size)',
      pageSize: '1000',
      orderBy: 'name',
    });
    if (pageToken) params.set('pageToken', pageToken);

    const res = await fetch(`https://www.googleapis.com/drive/v3/files?${params}`);
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Google Drive API error: ${res.status} - ${err}`);
    }

    const data: DriveListResponse = await res.json();
    allFiles.push(...(data.files || []));
    pageToken = data.nextPageToken || '';
  } while (pageToken);

  return allFiles;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const folderId = url.searchParams.get('folderId') || ROOT_FOLDER_ID;

    const items = await listFilesInFolder(folderId);

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
        const isImage = f.mimeType?.startsWith('image/') || /\.(png|jpg|jpeg|webp|gif)$/i.test(f.name);

        let fileType = 'other';
        if (isPdf) fileType = 'pdf';
        else if (isAudio) fileType = 'audio';
        else if (isImage) fileType = 'image';

        return {
          id: f.id,
          name: f.name,
          type: fileType,
          mimeType: f.mimeType,
          size: f.size ? parseInt(f.size) : null,
          viewUrl: isPdf ? `https://drive.google.com/file/d/${f.id}/preview` : null,
          downloadUrl: `https://drive.google.com/uc?export=download&id=${f.id}`,
          streamUrl: isAudio ? `https://${Deno.env.get('SUPABASE_PROJECT_REF') || 'yjvupzfstxywdmdkwhlr'}.supabase.co/functions/v1/stream-audio?id=${f.id}` : null,
          thumbnailUrl: isImage ? `https://drive.google.com/thumbnail?id=${f.id}&sz=w400` : null,
        };
      });

    return new Response(JSON.stringify({
      folderId,
      isRoot: folderId === ROOT_FOLDER_ID,
      folders,
      files,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error listing Drive files:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
