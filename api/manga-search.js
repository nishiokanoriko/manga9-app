export default async function handler(req, res) {
  const { title, limit } = req.query;
  if (!title) {
    return res.status(400).json({ error: 'title parameter is required' });
  }

  const params = new URLSearchParams();
  params.set('title', title);
  params.set('limit', limit || '20');
  params.append('includes[]', 'cover_art');
  params.append('includes[]', 'author');
  params.set('order[relevance]', 'desc');
  params.append('contentRating[]', 'safe');
  params.append('contentRating[]', 'suggestive');

  try {
    const response = await fetch(
      `https://api.mangadex.org/manga?${params.toString()}`
    );
    const data = await response.json();

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(response.status).json(data);
  } catch (e) {
    return res.status(502).json({ error: 'Failed to fetch from MangaDex API' });
  }
}
