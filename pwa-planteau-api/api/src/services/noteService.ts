import prisma from '../prisma';

export const findAll = async () => prisma.note.findMany();
export const findById = async (id: number) => prisma.note.findUnique({ where: { id } });
export const create = async (data: any) => prisma.note.create({ data });
export const remove = async (id: number) => prisma.note.delete({ where: { id } });
