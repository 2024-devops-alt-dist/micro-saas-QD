import prisma from '../prisma';

export const findAll = async () => prisma.tasks.findMany();
export const findById = async (id: number) => prisma.tasks.findUnique({ where: { id } });
export const create = async (data: any) => prisma.tasks.create({ data });
export const remove = async (id: number) => prisma.tasks.delete({ where: { id } });
