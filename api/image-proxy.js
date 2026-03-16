export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) {
    return res.status(400).send('url parameter is required');
  }

  // Only allow known image hosts
  const allowed = [
    'uploads.mangadex.org',
    'books.google.com',
    'books.googleusercontent.com',
    'lh3.googleusercontent.com',
    'covers.openlibrary.org',
  ];

  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return res.status(400).send('Invalid URL');
  }

  if (!allowed.some(host => parsed.hostname === host || parsed.hostname.endsWith('.' + host))) {
    return res.status(403).send('Host not allowed');
  }

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'manga9-app/1.0' },
    });

    if (!response.ok) {
      return res.status(response.status).send('Upstream error');
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const buffer = Buffer.from(await response.arrayBuffer());

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).send(buffer);
  } catch (e) {
    return res.status(502).send('Failed to fetch image');
  }
}
