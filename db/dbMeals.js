import db from './index.js';

export const createMealDay = async (mealId, dayId) => {
  await db.query('INSERT INTO meal_days (meal_id, day_id) VALUES ($1, $2)', [
    mealId,
    dayId,
  ]);
};

export const returnMealIngredients = async () => {
  const queryText =
    'SELECT i.name AS ingredient, SUM(amount) AS total, ut.name AS unit ' +
    'FROM meal_ingredients AS mi ' +
    'INNER JOIN ingredients AS i ON mi.ingredient_id = i.id ' +
    'INNER JOIN unit_types AS ut ON mi.unit_type_id = ut.id ' +
    'GROUP BY i.name, ut.name';

  return await db.query(queryText);
};
