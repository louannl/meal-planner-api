import prisma from '../../prisma.js';

export const findMany = (table) => prisma[table].findMany({
  select: {
    id: true,
    name: true,
  },
});

export const findById = (table, id) => prisma[table].findUnique({
  where: { id },
  select: {
    id: true,
    name: true,
  },
});

export const createName = (table, name) => prisma[table].create({
  data: {
    name,
  },
});

export const updateName = (table, name, id) => prisma[table].update({
  where: { id },
  data: { name },
});

export const deleteById = (table, id) => prisma[table].delete({
  where: { id },
});
