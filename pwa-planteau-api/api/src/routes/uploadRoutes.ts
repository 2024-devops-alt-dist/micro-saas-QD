import { Router } from 'express';
import multer from 'multer';
import path from 'path';

export const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'public/uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname.replace(/\s/g, '_'));
  },
});
const upload = multer({ storage });

router.post('/', (req, res, next) => {
  upload.single('file')(req, res, function (err) {
    if (err) {
      console.error('Erreur upload:', err);
      return res.status(500).json({ error: "Erreur lors de l'upload", details: err.message });
    }
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    // Correction: l'URL doit pointer vers /uploads
    const url = `/uploads/${req.file.filename}`;
    res.json({ url });
  });
});
