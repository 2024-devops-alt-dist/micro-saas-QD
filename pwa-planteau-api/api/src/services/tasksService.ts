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

export const update = async (id: number, data: any) => {
  // Met à jour la tâche
  const updated = await prisma.tasks.update({
    where: { id },
    data,
  });

  // Si la tâche passe à DONE et qu'elle est périodique, crée la prochaine tâche (si elle n'existe pas déjà)
  if (data.status === 'DONE' && updated.frequency_days && updated.frequency_days > 0) {
    // Calcule la date de la prochaine tâche
    const nextDate = new Date(updated.scheduled_date);
    nextDate.setDate(nextDate.getDate() + updated.frequency_days);

    // Vérifie si une tâche existe déjà pour cette plante, ce type, à cette date
    const existing = await prisma.tasks.findFirst({
      where: {
        plant_id: updated.plant_id,
        type: updated.type,
        scheduled_date: nextDate,
      },
    });
    if (!existing) {
      await prisma.tasks.create({
        data: {
          type: updated.type,
          scheduled_date: nextDate,
          status: 'TODO',
          plant_id: updated.plant_id,
          frequency_days: updated.frequency_days,
        },
      });
    }
  }
  return updated;
};
