export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/reviews') {
      const reply = (data, status = 200) => Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
      if (!env.BUCKET) return reply({ error: 'Reviews are temporarily unavailable. Please try again later.' }, 503);
      try {
        if (request.method === 'GET') {
          const listed = await env.BUCKET.list({ prefix: 'reviews/', limit: 50 });
          const reviews = await Promise.all(listed.objects.map(async object => {
            const record = await env.BUCKET.get(object.key);
            return record ? record.json() : null;
          }));
          return reply({ reviews: reviews.filter(Boolean).sort((a, b) => b.createdAt.localeCompare(a.createdAt)) });
        }
        if (request.method !== 'POST') return reply({ error: 'Method not allowed.' }, 405);
        if (request.headers.get('Origin') !== url.origin) return reply({ error: 'Please submit from this website.' }, 403);
        if (!request.headers.get('Content-Type')?.includes('application/json')) return reply({ error: 'Expected JSON.' }, 415);
        const raw = await request.text();
        if (raw.length > 8000) return reply({ error: 'Your review is too long.' }, 413);
        let data;
        try { data = JSON.parse(raw); } catch { return reply({ error: 'Invalid review format.' }, 400); }
        if (!data || typeof data !== 'object') return reply({ error: 'Invalid review.' }, 400);
        const name = typeof data.name === 'string' ? data.name.trim() : '';
        const text = typeof data.text === 'string' ? data.text.trim() : '';
        if (name.length < 2 || name.length > 80 || text.length < 20 || text.length > 1200 || !Number.isInteger(data.rating) || data.rating < 1 || data.rating > 5 || !['Website', 'Mobile app', 'SaaS product'].includes(data.project) || data.completed !== true || data.consent !== true) return reply({ error: 'Please complete all fields and confirmations. Reviews must contain 20–1,200 characters.' }, 400);
        // A stable submission ID makes retrying a failed connection safe.
        if (!/^[a-f0-9-]{36}$/i.test(data.id || '')) return reply({ error: 'Please refresh and try again.' }, 400);
        const key = `reviews/${data.id}.json`;
        const existing = await env.BUCKET.get(key);
        if (existing) return reply({ review: await existing.json() });
        const review = { id: data.id, name, text, project: data.project, rating: data.rating, createdAt: new Date().toISOString() };
        await env.BUCKET.put(key, JSON.stringify(review), { httpMetadata: { contentType: 'application/json' } });
        return reply({ review }, 201);
      } catch {
        return reply({ error: 'We couldn’t load or save the review. Please try again.' }, 503);
      }
    }
    if (!['GET', 'HEAD'].includes(request.method)) return new Response('Method not allowed', { status: 405 });
    const asset = ASSETS[url.pathname === '/' ? '/index.html' : url.pathname];
    if (!asset) return new Response('Not found', { status: 404 });
    return new Response(request.method === 'HEAD' ? null : asset.body, { headers: { 'Content-Type': asset.type, 'X-Content-Type-Options': 'nosniff' } });
  }
};
