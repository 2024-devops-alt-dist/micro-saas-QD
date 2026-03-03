import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { config } from '../config/env';

// Configuration Cloudinary
cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

/**
 * Upload une image vers Cloudinary
 * @param fileBuffer - Buffer du fichier
 * @param folder - Dossier Cloudinary (ex: 'planteau/users')
 * @param publicId - ID public optionnel (nom du fichier)
 */
export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  folder: string,
  publicId?: string
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadOptions: any = {
      folder,
      resource_type: 'image',
      transformation: [
        { width: 1200, height: 1200, crop: 'limit' }, // Limiter la taille
        { quality: 'auto' }, // Optimisation automatique
        { fetch_format: 'auto' }, // Format optimal (WebP si supporté)
      ],
    };

    if (publicId) {
      uploadOptions.public_id = publicId;
    }

    const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) return reject(error);
      resolve(result!);
    });
    uploadStream.end(fileBuffer);
  });
};

/**
 * Supprimer une image de Cloudinary
 * @param publicId - Public ID complet (ex: 'planteau/users/abc123')
 */
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  await cloudinary.uploader.destroy(publicId);
};

/**
 * Extraire le public_id depuis une URL Cloudinary
 * @param url - URL Cloudinary
 * @returns Public ID ou null
 */
export const extractPublicId = (url: string): string | null => {
  const match = url.match(/\/v\d+\/(.+)\.(jpg|jpeg|png|gif|webp)/i);
  return match && match[1] ? match[1] : null;
};
