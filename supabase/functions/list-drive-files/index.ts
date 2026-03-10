const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GOOGLE_API_KEY = Deno.env.get('GOOGLE_API_KEY')!;
const FOLDER_ID = '1D60NzFn3fDfEcAGUa1OkbzZnq4RoH4xR';

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  webContentLink?: string;
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
      fields: 'nextPageToken, files(id, name, mimeType, webViewLink, webContentLink)',
      pageSize: '1000',
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
    // List all items in the root folder
    const rootItems = await listFilesInFolder(FOLDER_ID);

    // Separate subfolders and loose files
    const subfolders = rootItems.filter(f => f.mimeType === 'application/vnd.google-apps.folder');
    const looseFiles = rootItems.filter(f => f.mimeType !== 'application/vnd.google-apps.folder');

    // For each subfolder, list its contents (each subfolder = one song)
    const songs = await Promise.all(
      subfolders.map(async (folder) => {
        const files = await listFilesInFolder(folder.id);

        const pdfFile = files.find(f =>
          f.mimeType === 'application/pdf' ||
          f.name.toLowerCase().endsWith('.pdf')
        );
        const audioFile = files.find(f =>
          f.mimeType?.startsWith('audio/') ||
          f.name.toLowerCase().match(/\.(mp3|wav|ogg|m4a)$/)
        );
        const imageFile = files.find(f =>
          f.mimeType?.startsWith('image/') ||
          f.name.toLowerCase().match(/\.(png|jpg|jpeg|webp)$/)
        );

        return {
          id: folder.id,
          folderName: folder.name,
          pdf: pdfFile ? {
            id: pdfFile.id,
            name: pdfFile.name,
            viewUrl: `https://drive.google.com/file/d/${pdfFile.id}/preview`,
            downloadUrl: `https://drive.google.com/uc?export=download&id=${pdfFile.id}`,
          } : null,
          audio: audioFile ? {
            id: audioFile.id,
            name: audioFile.name,
            streamUrl: `https://docs.google.com/uc?export=download&id=${audioFile.id}`,
          } : null,
          image: imageFile ? {
            id: imageFile.id,
            name: imageFile.name,
            url: `https://drive.google.com/thumbnail?id=${imageFile.id}&sz=w400`,
          } : null,
          allFiles: files.map(f => ({ id: f.id, name: f.name, mimeType: f.mimeType })),
        };
      })
    );

    // Sort alphabetically by folder name
    songs.sort((a, b) => a.folderName.localeCompare(b.folderName));

    return new Response(JSON.stringify({
      songs,
      looseFiles: looseFiles.map(f => ({ id: f.id, name: f.name, mimeType: f.mimeType })),
      totalFolders: subfolders.length,
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
