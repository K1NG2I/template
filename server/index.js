import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { authMiddleware } from './middleware/auth.js';
import { getConfig, updateConfig } from './routes/config.js';
import { uploadMiddleware, handleUpload } from './routes/upload.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/assets', express.static('../assets'));

app.post('/api/auth', (req, res) => {
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
  if (req.body.password === ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Wrong password' });
  }
});

app.get('/api/config', getConfig);

app.put('/api/config', authMiddleware, updateConfig);
app.post('/api/upload', authMiddleware, uploadMiddleware, handleUpload);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
