import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed Vehicle Types
  const suv = await prisma.vehicleType.create({
    data: { name: 'SUV', wheelCount: 4 }
  });
  const sedan = await prisma.vehicleType.create({
    data: { name: 'Sedan', wheelCount: 4 }
  });
  const hatchback = await prisma.vehicleType.create({
    data: { name: 'Hatchback', wheelCount: 4 }
  });
  const cruiser = await prisma.vehicleType.create({
    data: { name: 'Cruiser', wheelCount: 2 }
  });

  // Seed Vehicles
  await prisma.vehicle.createMany({
    data: [
      { modelName: 'Hyundai Creta', typeId: suv.id },
      { modelName: 'Toyota Fortuner', typeId: suv.id },
      { modelName: 'Honda City', typeId: sedan.id },
      { modelName: 'Maruti Swift', typeId: hatchback.id },
      { modelName: 'Royal Enfield Classic 350', typeId: cruiser.id },
    ]
  });

  // Seed a User
  const user = await prisma.user.create({
    data: {
      firstName: 'Alister',
      lastName: 'Hosamani',
    }
  });

  console.log('Seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
