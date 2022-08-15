import prisma from '../prisma.js';

const resetDb = async () => {
  await prisma.$queryRaw`
    TRUNCATE meal_days, meal_ingredients, meal_tags, meals, ingredients, tags 
    RESTART IDENTITY
  `;
};

export default resetDb;
