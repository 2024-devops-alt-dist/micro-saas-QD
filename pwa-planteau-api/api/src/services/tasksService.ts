import prisma from '../prisma';

export const findAllByHousehold = async (householdId: number) =>
  prisma.tasks.findMany({
    where: {
      plant: {
        household_id: householdId,
      },
    },
    include: {
      plant: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
export const findById = async (id: number) =>
  prisma.tasks.findUnique({
    where: { id },
    include: {
      plant: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
export const create = async (data: any) => {
  // Convertir scheduled_date de string ISO en Date object
  if (data.scheduled_date && typeof data.scheduled_date === 'string') {
    data.scheduled_date = new Date(data.scheduled_date);
  }
  return prisma.tasks.create({ data });
};
export const remove = async (id: number) => prisma.tasks.delete({ where: { id } });

export const update = async (id: number, data: any) =>
  prisma.tasks.update({
    where: { id },
    data,
  });
