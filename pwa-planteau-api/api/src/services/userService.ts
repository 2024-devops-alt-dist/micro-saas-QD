import prisma from '../prisma';

export const findAll = async () => prisma.user.findMany();
export const findById = async (id: number) => prisma.user.findUnique({ where: { id } });
export const create = async (data: any) => prisma.user.create({ data });
export const remove = async (id: number) => prisma.user.delete({ where: { id } });
