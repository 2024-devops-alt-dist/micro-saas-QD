import prisma from '../prisma';

export const findAll = async () => {
  return prisma.household.findMany();
};

export const findById = async (id: number) => {
  return prisma.household.findUnique({ where: { id } });
};

export const create = async (data: any) => {
  return prisma.household.create({ data });
};

export const remove = async (id: number) => {
  return prisma.household.delete({ where: { id } });
};

export const update = async (id: number, data: any) => {
  return prisma.household.update({
    where: { id },
    data,
  });
};
