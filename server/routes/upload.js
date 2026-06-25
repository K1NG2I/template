import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import multer from 'multer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const assetsDir = join(__dirname, '..', '..', 'assets');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const subdir = file.mimetype.startsWith('video') ? 'videos' : 'images';
    cb(null, join(assetsDir, subdir));
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = file.originalname.split('.').pop();
    cb(null, unique + '.' + ext);
  },
});

const upload = multer({ storage });

export const uploadMiddleware = upload.single('file');

export function handleUpload(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const subdir = req.file.mimetype.startsWith('video') ? 'videos' : 'images';
  const url = `/assets/${subdir}/${req.file.filename}`;
  res.json({ url });
}
