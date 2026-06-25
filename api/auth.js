export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  if (req.body?.password === ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Wrong password' });
  }
}
