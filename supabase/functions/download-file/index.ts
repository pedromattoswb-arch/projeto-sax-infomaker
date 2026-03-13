const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const GOOGLE_API_KEY = Deno.env.get('GOOGLE_API_KEY')!;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const fileId = url.searchParams.get('id');

    if (!fileId) {
      return new Response(JSON.stringify({ error: 'Missing file id' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get file metadata first to get the name and mimeType
    const metaRes = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?key=${GOOGLE_API_KEY}&fields=name,mimeType,size`
    );
    if (!metaRes.ok) {
      throw new Error(`Failed to get file metadata: ${metaRes.status}`);
    }
    const meta = await metaRes.json();

    // Download the file content
    const downloadRes = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${GOOGLE_API_KEY}`
    );
    if (!downloadRes.ok) {
      throw new Error(`Failed to download file: ${downloadRes.status}`);
    }

    const body = downloadRes.body;
    const fileName = meta.name || 'download';
    const contentType = meta.mimeType || 'application/octet-stream';

    return new Response(body, {
      headers: {
        ...corsHeaders,
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"`,
        ...(meta.size ? { 'Content-Length': meta.size } : {}),
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
