
import prisma from '../config/db-connection';

async function main() {
  // 1. Households
  const household1 = await prisma.household.create({
    data: { name: 'Famille Martin', invite_code: 'MARTIN2025' },
  });
  const household2 = await prisma.household.create({
    data: { name: 'Coloc des Plantes', invite_code: 'PLANTCOL2025' },
  });

  // 2. Users
  const user1 = await prisma.user.create({
    data: {
      name: 'Martin', firstname: 'Paul', email: 'paul.martin@example.com', password: 'hashedpwd1', role: 'ADMIN', household_id: household1.id,
    },
  });
  const user2 = await prisma.user.create({
    data: {
      name: 'Dupont', firstname: 'Sophie', email: 'sophie.dupont@example.com', password: 'hashedpwd2', role: 'MEMBER', household_id: household1.id,
    },
  });
  const user3 = await prisma.user.create({
    data: {
      name: 'Durand', firstname: 'Luc', email: 'luc.durand@example.com', password: 'hashedpwd3', role: 'MEMBER', household_id: household2.id,
    },
  });

  // 3. Plants (adapté des mocks)
  // Injection de toutes les plantes du mock
  const mockPlants = [
    { name: 'Monstera', scientific_name: 'Monstera deliciosa', type: 'Intérieur', photo: '/assets/images/monstera.jpg', water_need: 'Tous les 3 jours', room: 'Salon' },
    { name: 'Ficus', scientific_name: 'Ficus lyrata', type: 'Intérieur', photo: '/assets/images/ficus.jpg', water_need: 'Tous les 5 jours', room: 'Chambre 1' },
    { name: 'Calathea', scientific_name: 'Calathea orbifolia', type: 'Intérieur', photo: '/assets/images/calathea.jpg', water_need: 'Tous les 4 jours', room: 'Salon' },
    { name: 'Pothos', scientific_name: 'Scindapsus aureus', type: 'Intérieur', photo: '/assets/images/pothos.webp', water_need: 'Tous les 7 jours', room: 'Cuisine' },
    { name: 'Maranta', scientific_name: 'Maranta leuconeura', type: 'Intérieur', photo: '/assets/images/maranta.webp', water_need: 'Tous les 4 jours', room: 'Chambre 2' },
    { name: 'Alocasia', scientific_name: 'Alocasia zebrina', type: 'Intérieur', photo: '/assets/images/alocasia-zebrina.webp', water_need: 'Tous les 6 jours', room: 'Salon' },
    { name: 'Lierre', scientific_name: 'Hedera helix', type: 'Intérieur', photo: '/assets/images/lierre.webp', water_need: 'Tous les 5 jours', room: 'Couloir' },
    { name: 'Palmier Areca', scientific_name: 'Dypsis lutescens', type: 'Intérieur', photo: '/assets/images/palmier.jpg', water_need: 'Tous les 3 jours', room: 'Salon' }
  ];
  // Répartition entre les households
  const createdPlants = [];
  for (let i = 0; i < mockPlants.length; i++) {
    const plant = mockPlants[i];
    if (!plant) continue;
    // Mapper explicitement les valeurs du mock vers l'enum PlantType Prisma
    let prismaType: 'TROPICAL' | 'TEMPERATE' = 'TROPICAL';
    if (plant.type === 'Extérieur') {
      prismaType = 'TEMPERATE';
    } else if (plant.type === 'Intérieur') {
      prismaType = 'TROPICAL';
    }
    // Répartition du créateur (user) et du household
    const household_id = i < 4 ? household1.id : household2.id;
    const user_id = i < 4 ? user1.id : user3.id;
    const created = await prisma.plant.create({
      data: {
        name: plant.name,
        scientific_name: plant.scientific_name,
        type: prismaType,
        photo: plant.photo,
        water_need: plant.water_need,
        room: plant.room,
        user_id,
        household_id
      },
    });
    createdPlants.push(created);
  }

  // 4. Tasks (adapté des mocks)
  await prisma.tasks.createMany({
    data: [
      { type: 'WATERING', scheduled_date: new Date('2025-10-17'), status: 'TODO', plant_id: createdPlants[0]!.id },
      { type: 'WATERING', scheduled_date: new Date('2025-11-12'), status: 'TODO', plant_id: createdPlants[1]!.id },
      { type: 'WATERING', scheduled_date: new Date('2025-11-13'), status: 'TODO', plant_id: createdPlants[2]!.id },
      { type: 'WATERING', scheduled_date: new Date('2025-10-30'), status: 'TODO', plant_id: createdPlants[3]!.id },
      { type: 'WATERING', scheduled_date: new Date('2025-10-19'), status: 'TODO', plant_id: createdPlants[4]!.id },
    ],
  });

  // 5. Notes (exemple)
  await prisma.note.create({
    data: {
      content: 'Penser à arroser plus souvent en été.', user_id: user1.id, plant_id: createdPlants[0]!.id,
    },
  });

  console.log('Fixtures insérées avec succès !');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
