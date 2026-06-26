import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const DEFAULT_CONFIG = {
  discountBar: { text: '' },
  header: { logo: '', logoWidth: 40, logoHeight: 40, navLinks: [{ label: 'Home', path: '/' }, { label: 'Shop', path: '/shop' }] },
  fonts: { family: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif", googleFontLink: '' },
  hero: { video: '', posterImage: '', headline: 'Welcome', subtext: '', ctaText: 'Shop Now', ctaLink: '/shop' },
  shopFlash: { heading: 'Featured Products' },
  products: [],
  showcase: { heading: 'Showcase', cards: [] },
  about: { text: '', rules: [] },
  notes: { heading: 'Important Notes', rules: [] },
  footer: { text: '', email: '' },
  colors: {
    dark: { '--bg': '#2c2c2c', '--card': '#2c2c2c', '--accent': '#ECAA2F', '--muted': '#c7c7d7', '--primary': '#ffffff', '--nav-bg': '#2c2c2c', '--bg-secondary': '#222222', '--bg-tertiary': '#1a1a1a', '--border': 'rgba(255, 255, 255, 0.1)' },
    light: { '--bg': '#f5f5f5', '--card': '#ffffff', '--accent': '#d4942b', '--muted': '#555555', '--primary': '#1a1a1a', '--nav-bg': '#ffffff', '--bg-secondary': '#e8e8e8', '--bg-tertiary': '#d8d8d8', '--border': 'rgba(0, 0, 0, 0.1)' },
  },
};

function checkAuth(req, res) {
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  const password = req.headers['x-admin-password'];
  if (password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('config')
      .select('data')
      .eq('id', 1)
      .single();

    if (error || !data) {
      return res.json(DEFAULT_CONFIG);
    }
    return res.json(data.data);
  }

  if (req.method === 'PUT') {
    if (!checkAuth(req, res)) return;
    const { data, error } = await supabase
      .from('config')
      .upsert({ id: 1, data: req.body, updated_at: new Date().toISOString() })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to save config' });
    }
    return res.json({ success: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
