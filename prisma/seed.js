import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const days = [
  { id: 1, name: 'Monday' },
  { id: 2, name: 'Tuesday' },
  { id: 3, name: 'Wednesday' },
  { id: 4, name: 'Thursday' },
  { id: 5, name: 'Friday' },
  { id: 6, name: 'Saturday' },
  { id: 7, name: 'Sunday' },
];

const unitTypes = [
  { id: 1, name: 'grams', symbol: 'g' },
  { id: 2, name: 'millilitres', symbol: 'ml' },
  { id: 3, name: 'amount', symbol: 'Amo.' },
  { id: 4, name: 'tablespoon', symbol: 'tbsp' },
  { id: 5, name: 'teaspoon', symbol: 'tsp' },
];

const main = async () => {
  await prisma.days.createMany({
    data: days,
  });
  await prisma.unit_types.createMany({
    data: unitTypes,
  });
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
