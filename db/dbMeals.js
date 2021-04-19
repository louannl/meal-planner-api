const db = require('../db');
const dbHandler = require('./dbHandlers');

exports.existingIngredients = async (names) => {
  const { rows } = await db.query(
    `SELECT name from ingredients WHERE name IN (${dbHandler.parameterise(
      names
    )})`,
    names
  );
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

exports.createMealDay = async (mealId, dayId, tagId) => {
  await db.query(
    'INSERT INTO meal_days (meal_id, day_id, tag_id) VALUES ($1, $2, $3)',
    []
  );
};
