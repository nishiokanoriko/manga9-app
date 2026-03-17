export default async function handler(req, res) {
  const { mangaId } = req.query;
  if (!mangaId) {
    return res.status(400).json({ error: 'mangaId parameter is required' });
  }

  try {
    let allData = [];
    let offset = 0;
    const limit = 100;

    while (true) {
      const params = new URLSearchParams();
      params.append('manga[]', mangaId);
      params.set('order[volume]', 'asc');
      params.set('limit', String(limit));
      params.set('offset', String(offset));

      const response = await fetch(
        `https://api.mangadex.org/cover?${params.toString()}`
      );
      if (!response.ok) {
        return res.status(response.status).json(await response.json());
      }
      const data = await response.json();
      allData = allData.concat(data.data || []);

      const total = data.total || 0;
      offset += limit;
      if (offset >= total) break;
    }

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).json({ result: 'ok', data: allData, total: allData.length });
  } catch (e) {
    return res.status(502).json({ error: 'Failed to fetch from MangaDex Cover API' });
  }
}
