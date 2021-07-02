import db from './index.js';
//TODO: sort routes and remove logic

export const insertIngredient = async (name) => {
  return await db.query('INSERT INTO ingredients (name) VALUES ($1)', [name]);
};

export const updateIngredient = async (id, name) => {
  return await db.query(`UPDATE ingredients SET name = $1 WHERE id = $2`, [
    name,
    id,
  ]);
};

export const insertMealIngredient = async (mealId, ingredient) => {
  const { ingredientId, amount, unitTypeId } = ingredient;
  console.log(ingredient, ingredientId, amount, unitTypeId);
  await db.query(
    'INSERT INTO meal_ingredients (meal_id, ingredient_id, amount, unit_type_id) VALUES ($1, $2, $3, $4)',
    [mealId, ingredientId, amount, unitTypeId]
  );
};

export const returnMealIngredients = async (mealId) => {
  return await db.query(
    `
    SELECT i.name AS ingredient, mi.amount AS amount, ut.name AS unit, ut.id AS id
    FROM meal_ingredients AS mi
    JOIN ingredients AS i ON mi.ingredient_id = i.id
    JOIN unit_types AS ut ON mi.unit_type_id = ut.id
    WHERE mi.meal_id = $1`,
    [mealId]
  );
};
