export default async function handler(req, res) {
  const { mangaId } = req.query;
  if (!mangaId) {
    return res.status(400).json({ error: 'mangaId parameter is required' });
  }

  try {
    const params = new URLSearchParams();
    params.append('manga[]', mangaId);
    params.set('order[volume]', 'asc');
    params.set('limit', '1');

    const response = await fetch(
      `https://api.mangadex.org/cover?${params.toString()}`
    );
    const data = await response.json();

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    return res.status(response.status).json(data);
  } catch (e) {
    return res.status(502).json({ error: 'Failed to fetch from MangaDex Cover API' });
  }
}
