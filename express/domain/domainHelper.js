import prisma from '../../prisma.js';

export default async (table, name) => {
  await prisma[table].create({
    data: {
      name,
    },
  });
};
