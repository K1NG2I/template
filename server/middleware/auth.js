const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export function authMiddleware(req, res, next) {
  if (req.path === '/auth') return next();

  const password = req.headers['x-admin-password'];
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}
