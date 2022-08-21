import prisma from '../../prisma.js';

const createMealIngredient = (
  transaction,
  mealId,
  ingredient,
) => transaction.meal_ingredients.create({
  data: {
    meals: {
      connect: { id: mealId },
    },
    unit_types: {
      connect: { id: Number(ingredient.unitType) },
    },
    amount: Number(ingredient.amount),
    ingredients: {
      connectOrCreate: {
        create: { name: ingredient.name },
        where: { name: ingredient.name },
      },
    },
  },
});

export const createMealIngredients = async (transaction, mealId, ingredients) => {
  await Promise.all(
    ingredients.map((ingredient) => createMealIngredient(transaction, mealId, ingredient)),
  );
};

export const getSummarisedIngredients = () => prisma.$queryRaw`
  SELECT i.name AS ingredient, (SUM(amount))::text AS total, ut.name AS unit 
  FROM meal_ingredients AS mi 
  INNER JOIN ingredients AS i ON mi.ingredient_id = i.id 
  INNER JOIN unit_types AS ut ON mi.unit_type_id = ut.id 
  INNER JOIN meal_days AS md ON mi.meal_id = md.meal_id 
  GROUP BY i.name, ut.name
`;
