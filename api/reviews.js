import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    if (req.query.all === '1') {
      const { data, error } = await supabase
        .from('reviews')
        .select('product_index, rating');

      if (error) return res.status(500).json({ error: error.message });

      const grouped = {};
      for (const r of data || []) {
        if (!grouped[r.product_index]) grouped[r.product_index] = { total: 0, count: 0 };
        grouped[r.product_index].total += r.rating;
        grouped[r.product_index].count += 1;
      }

      const result = {};
      for (const [idx, g] of Object.entries(grouped)) {
        result[idx] = {
          average: Math.round((g.total / g.count) * 10) / 10,
          count: g.count,
        };
      }
      return res.json(result);
    }

    const productIndex = req.query.product;
    if (productIndex === undefined) {
      return res.status(400).json({ error: 'Missing product param' });
    }
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_index', Number(productIndex))
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });

    const count = data.length;
    const average = count > 0
      ? Math.round((data.reduce((s, r) => s + r.rating, 0) / count) * 10) / 10
      : 0;

    return res.json({ average, count, reviews: data });
  }

  if (req.method === 'POST') {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Not authenticated' });

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return res.status(401).json({ error: 'Invalid token' });

    const { product_index, rating, comment } = req.body;
    if (product_index === undefined || !rating) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { error: insertError } = await supabase.from('reviews').insert({
      product_index,
      user_id: user.id,
      user_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous',
      rating,
      comment: comment || '',
    });

    if (insertError) return res.status(500).json({ error: insertError.message });
    return res.json({ success: true });
  }

  if (req.method === 'DELETE') {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Not authenticated' });

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return res.status(401).json({ error: 'Invalid token' });

    const { id } = req.body || req.query;
    if (!id) return res.status(400).json({ error: 'Missing review id' });

    const { error: delError } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (delError) return res.status(500).json({ error: delError.message });
    return res.json({ success: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
