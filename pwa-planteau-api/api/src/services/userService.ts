import prisma from '../prisma';
import { deleteFromCloudinary, extractPublicId } from './cloudinaryService';

export const findAll = async () => prisma.user.findMany();
export const findById = async (id: number) => prisma.user.findUnique({ where: { id } });
export const create = async (data: any) => prisma.user.create({ data });

export const remove = async (id: number) => {
  // Récupère l'utilisateur pour obtenir l'URL de la photo
  const user = await prisma.user.findUnique({ where: { id } });

  if (user && user.photo) {
    // Supprime la photo de Cloudinary
    const publicId = extractPublicId(user.photo);
    if (publicId) {
      await deleteFromCloudinary(publicId);
    }
  }

  // Supprime l'utilisateur de la BD
  return prisma.user.delete({ where: { id } });
};

export const update = async (id: number, data: any) =>
  prisma.user.update({
    where: { id },
    data,
  });
