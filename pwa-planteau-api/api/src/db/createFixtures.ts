import prisma from '../prisma';
import bcrypt from 'bcrypt';

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

async function main() {
  console.log('🧹 Nettoyage de la base de données...');

  // TRUNCATE all tables to start fresh
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "Note" RESTART IDENTITY CASCADE');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "Tasks" RESTART IDENTITY CASCADE');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "Plant" RESTART IDENTITY CASCADE');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "User" RESTART IDENTITY CASCADE');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "Household" RESTART IDENTITY CASCADE');

  console.log('✅ Base de données nettoyée\n');
  console.log('📝 Insertion des fixtures...\n');

  // 1. Households (find or create to be idempotent)
  let household1 = await prisma.household.findFirst({ where: { invite_code: 'QUENTIN2025' } });
  if (!household1) {
    household1 = await prisma.household.create({
      data: { name: 'Appartement Quentin', invite_code: 'QUENTIN2025' },
    });
  }

  let household2 = await prisma.household.findFirst({ where: { invite_code: 'PLANTCOL2025' } });
  if (!household2) {
    household2 = await prisma.household.create({
      data: { name: 'Coloc des Plantes', invite_code: 'PLANTCOL2025' },
    });
  }

  let household3 = await prisma.household.findFirst({ where: { invite_code: 'MAISONJADE2026' } });
  if (!household3) {
    household3 = await prisma.household.create({
      data: { name: 'Maison Jade', invite_code: 'MAISONJADE2026' },
    });
  }

  // 2. Users (upsert on unique email)
  const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
  const user1 = await prisma.user.upsert({
    where: { email: 'quentin@gmail.com' },
    update: { household_id: household1.id },
    create: {
      name: 'Degli',
      firstname: 'Quentin',
      email: 'quentin@gmail.com',
      password: await hashPassword('password'),
      photo: `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/quentin_ki5kdz`,
      role: 'ADMIN',
      household_id: household1.id,
    },
  });

  await prisma.user.upsert({
    where: { email: 'jessy@gmail.com' },
    update: { household_id: household1.id },
    create: {
      name: 'Rebelo',
      firstname: 'Jessy',
      email: 'jessy@gmail.com',
      password: await hashPassword('password'),
      photo: `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/jessy_vh4h0q`,
      role: 'MEMBER',
      household_id: household1.id,
    },
  });

  const user3 = await prisma.user.upsert({
    where: { email: 'camille@gmail.com' },
    update: { household_id: household2.id },
    create: {
      name: 'Janin',
      firstname: 'Camille',
      email: 'camille@gmail.com',
      password: await hashPassword('password'),
      photo: `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/camille_kpqz0n`,
      role: 'MEMBER',
      household_id: household2.id,
    },
  });

  const user4 = await prisma.user.upsert({
    where: { email: 'jade@gmail.com' },
    update: { household_id: household3.id },
    create: {
      name: 'Rebelo',
      firstname: 'Jade',
      email: 'jade@gmail.com',
      password: await hashPassword('password'),
      role: 'MEMBER',
      household_id: household3.id,
    },
  });

  // 3. Plants (adapté des mocks)
  // Injection de toutes les plantes du mock
  const mockPlants = [
    {
      name: 'Monstera',
      scientific_name: 'Monstera deliciosa',
      type: 'TROPICAL' as const,
      photo: `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/monstera_ynf2t7`,
      water_need: 'Tous les 3 jours',
      room: 'Salon',
    },
    {
      name: 'Ficus',
      scientific_name: 'Ficus lyrata',
      type: 'TROPICAL' as const,
      photo: `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/ficus_jwrxki`,
      water_need: 'Tous les 5 jours',
      room: 'Chambre 1',
    },
    {
      name: 'Calathea',
      scientific_name: 'Calathea orbifolia',
      type: 'TROPICAL' as const,
      photo: `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/calathea_a7tgof`,
      water_need: 'Tous les 4 jours',
      room: 'Salon',
    },
    {
      name: 'Pothos',
      scientific_name: 'Scindapsus aureus',
      type: 'TROPICAL' as const,
      photo: `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/pothos_fphwwn`,
      water_need: 'Tous les 7 jours',
      room: 'Cuisine',
    },
    {
      name: 'Maranta',
      scientific_name: 'Maranta leuconeura',
      type: 'TROPICAL' as const,
      photo: `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/maranta_xiuz2m`,
      water_need: 'Tous les 4 jours',
      room: 'Chambre 2',
    },
    {
      name: 'Alocasia',
      scientific_name: 'Alocasia zebrina',
      type: 'TROPICAL' as const,
      photo: `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/Alocasia-zebrina_rljei4`,
      water_need: 'Tous les 6 jours',
      room: 'Salon',
    },
    {
      name: 'Lierre',
      scientific_name: 'Hedera helix',
      type: 'TEMPERATE' as const,
      photo: `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/lierre_ywo1ca`,
      water_need: 'Tous les 5 jours',
      room: 'Couloir',
    },
    {
      name: 'Palmier Areca',
      scientific_name: 'Dypsis lutescens',
      type: 'TROPICAL' as const,
      photo: `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/palmier_iyanjz`,
      water_need: 'Tous les 3 jours',
      room: 'Salon',
    },
  ];
  // Répartition entre les households
  const createdPlants = [];
  for (let i = 0; i < mockPlants.length; i++) {
    const plant = mockPlants[i];
    if (!plant) continue;
    // Répartition du créateur (user) et du household
    const household_id = i < 4 ? household1.id : household2.id;
    const user_id = i < 4 ? user1.id : user3.id;
    // create only if not already present for this household
    const existing = await prisma.plant.findFirst({ where: { name: plant.name, household_id } });
    if (!existing) {
      const created = await prisma.plant.create({
        data: {
          name: plant.name,
          scientific_name: plant.scientific_name,
          type: plant.type,
          photo: plant.photo,
          water_need: plant.water_need,
          room: plant.room,
          user_id,
          household_id,
        },
      });
      createdPlants.push(created);
    } else {
      createdPlants.push(existing);
    }
  }

  // 4. Tasks (adapté des mocks)
  // Only create tasks if none exist for these plants
  const plantIds = createdPlants.map(p => p.id);
  const existingTasksCount = await prisma.tasks.count({ where: { plant_id: { in: plantIds } } });
  if (existingTasksCount === 0) {
    await prisma.tasks.createMany({
      data: [
        {
          type: 'WATERING',
          scheduled_date: new Date('2026-03-05'),
          status: 'TODO',
          plant_id: createdPlants[0]!.id,
        },
        {
          type: 'WATERING',
          scheduled_date: new Date('2026-03-10'),
          status: 'TODO',
          plant_id: createdPlants[1]!.id,
        },
        {
          type: 'WATERING',
          scheduled_date: new Date('2026-03-15'),
          status: 'TODO',
          plant_id: createdPlants[2]!.id,
        },
        {
          type: 'WATERING',
          scheduled_date: new Date('2026-03-24'),
          status: 'TODO',
          plant_id: createdPlants[3]!.id,
        },
        {
          type: 'WATERING',
          scheduled_date: new Date('2026-03-25'),
          status: 'TODO',
          plant_id: createdPlants[4]!.id,
        },
      ],
    });
  }

  // 5. Notes (exemple)
  // Create a sample note if it doesn't already exist
  const existingNote = await prisma.note.findFirst({
    where: {
      content: 'Penser à arroser plus souvent en été.',
      user_id: user1.id,
      plant_id: createdPlants[0]!.id,
    },
  });
  if (!existingNote) {
    await prisma.note.create({
      data: {
        content: 'Penser à arroser plus souvent en été.',
        user_id: user1.id,
        plant_id: createdPlants[0]!.id,
      },
    });
  }

  console.log('Fixtures insérées avec succès !');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
