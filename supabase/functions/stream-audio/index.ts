const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    // Use Google Drive API to get direct media stream
    const driveUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${GOOGLE_API_KEY}`;
    
    // Forward range headers for seeking support
    const headers: Record<string, string> = {};
    const rangeHeader = req.headers.get('Range');
    if (rangeHeader) {
      headers['Range'] = rangeHeader;
    }

    const response = await fetch(driveUrl, { headers });

    if (!response.ok && response.status !== 206) {
      throw new Error(`Google Drive API error: ${response.status}`);
    }

    const responseHeaders: Record<string, string> = {
      ...corsHeaders,
      'Content-Type': response.headers.get('Content-Type') || 'audio/mpeg',
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=3600',
    };

    // Forward content-related headers
    const contentLength = response.headers.get('Content-Length');
    if (contentLength) responseHeaders['Content-Length'] = contentLength;
    
    const contentRange = response.headers.get('Content-Range');
    if (contentRange) responseHeaders['Content-Range'] = contentRange;

    return new Response(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Stream error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
