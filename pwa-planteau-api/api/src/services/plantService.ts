import prisma from '../prisma';
import { deleteFromCloudinary, extractPublicId } from './cloudinaryService';

export const findAll = async () => prisma.plant.findMany();
export const findById = async (id: number) => prisma.plant.findUnique({ where: { id } });
export const create = async (data: any) => prisma.plant.create({ data });

export const remove = async (id: number) => {
  // Récupère la plante pour obtenir l'URL de la photo
  const plant = await prisma.plant.findUnique({ where: { id } });

  if (plant && plant.photo) {
    // Supprime la photo de Cloudinary
    const publicId = extractPublicId(plant.photo);
    if (publicId) {
      await deleteFromCloudinary(publicId);
    }
  }

  // Supprime la plante de la BD
  return prisma.plant.delete({ where: { id } });
};

export const update = async (id: number, data: any) =>
  prisma.plant.update({
    where: { id },
    data,
  });
