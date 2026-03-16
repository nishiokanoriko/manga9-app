export default async function handler(req, res) {
  const { q, langRestrict, maxResults } = req.query;
  if (!q) {
    return res.status(400).json({ error: 'q parameter is required' });
  }

  const params = new URLSearchParams();
  params.set('q', q);
  params.set('maxResults', maxResults || '20');
  params.set('printType', 'books');
  if (langRestrict) params.set('langRestrict', langRestrict);

  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?${params.toString()}`
    );
    const data = await response.json();

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(response.status).json(data);
  } catch (e) {
    return res.status(502).json({ error: 'Failed to fetch from Google Books API' });
  }
}
