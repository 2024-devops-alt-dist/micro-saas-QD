import { Router, Request, Response } from 'express';
import multer from 'multer';
import { uploadToCloudinary } from '../services/cloudinaryService';

export const router = Router();

// Multer en mode memory (pas de stockage local)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Seules les images sont autorisées'));
    }
    cb(null, true);
  },
});

router.post('/', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier uploadé' });
    }

    // Déterminer le dossier selon le contexte (optionnel)
    const folder = req.body.type === 'user' ? 'planteau/users' : 'planteau/plants';

    // Upload vers Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, folder);

    // Retourner l'URL sécurisée
    res.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error: any) {
    console.error('Erreur upload Cloudinary:', error);
    res.status(500).json({
      error: "Erreur lors de l'upload",
      details: error.message,
    });
  }
});
