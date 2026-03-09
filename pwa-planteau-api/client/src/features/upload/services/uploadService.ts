/**
 * Service dédié aux uploads de fichiers
 * Utilise Axios pour gérer les uploads
 */

import api from '../../../services/apiClient';

interface UploadResponse {
  url: string;
  publicId: string;
}

export const uploadService = {
  /**
   * Upload un fichier vers Cloudinary via le serveur
   * @param file Le fichier à uploader
   * @param type Le type d'upload (plant, user, etc.)
   */
  async uploadFile(file: File, type: 'plant' | 'user'): Promise<UploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      // Axios gère bien FormData sans besoin de headers spéciaux
      const response = await api.post<UploadResponse>('/upload', formData);
      return response.data;
    } catch (error) {
      console.error('Failed to upload file:', error);
      throw error;
    }
  },
};
