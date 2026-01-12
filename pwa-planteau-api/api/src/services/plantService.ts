import prisma from '../prisma';

export const findAll = async () => prisma.plant.findMany();
export const findById = async (id: number) => prisma.plant.findUnique({ where: { id } });
export const create = async (data: any) => prisma.plant.create({ data });
export const remove = async (id: number) => prisma.plant.delete({ where: { id } });

export const update = async (id: number, data: any) =>
  prisma.plant.update({
    where: { id },
    data,
  });
