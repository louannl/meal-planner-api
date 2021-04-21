import db from './index.js';
//TODO: sort routes and remove logic

export const insertIngredient = async (name, unitTypeId) => {
  const {
    rowCount,
  } = await db.query(
    'INSERT INTO ingredients (name, unit_type_id) VALUES ($1, $2)',
    [name, unitTypeId]
  );
  return rowCount;
};

export const updateIngredient = async (name, unitTypeId, id) => {
  const {
    rowCount,
  } = await db.query(
    `UPDATE ingredients SET name = $1, unit_type_id = $2 WHERE id = $3`,
    [name, unitTypeId, id]
  );
  return rowCount;
};

export const insertMealIngredient = async (mealId, ingredient) => {
  const { ingredientId, amount, unitTypeId } = ingredient;
  console.log(ingredient, ingredientId, amount, unitTypeId);
  await db.query(
    'INSERT INTO meal_ingredients (meal_id, ingredient_id, amount, unit_type_id) VALUES ($1, $2, $3, $4)',
    [mealId, ingredientId, amount, unitTypeId]
  );
};
