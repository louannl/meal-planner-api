const db = require('../db');
const dbHandler = require('./dbHandlers');

exports.existingNames = async (table, names) => {
  const { rows } = await db.query(
    `SELECT name from ${table} WHERE name IN (${dbHandler.parameterise(
      names
    )})`,
    names
  );

  if (rows === undefined) {
    return [];
  }

  return rows;
};

exports.createMealIngredients = async (
  mealId,
  ingredientId,
  amount,
  unitType
) => {
  await db.query(
    'INSERT INTO meal_ingredients (meal_id, ingredient_id, amount, unit_type_id) VALUES ($1, $2, $3, $4)',
    [mealId, ingredientId, amount, unitType]
  );
};

exports.createMealDay = async (mealId, dayId) => {
  await db.query('INSERT INTO meal_days (meal_id, day_id) VALUES ($1, $2)', [
    mealId,
    dayId,
  ]);
};
