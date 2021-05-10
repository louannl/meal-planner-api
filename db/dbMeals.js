import db from './index.js';
//TODO: create temperal literals instead

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

export const returnMealsByDay = async () => {
  const queryText = `SELECT DISTINCT m.id AS meal_id, m.name AS meal, d.name AS day, t.name AS tags 
  FROM meals AS m 
  INNER JOIN meal_days AS md ON m.id = md.meal_id 
  INNER JOIN meal_tags AS mt ON m.id = mt.meal_id 
  INNER JOIN days AS d ON md.day_id = d.id 
  INNER JOIN meals ON md.meal_id = m.id 
  INNER JOIN tags AS t ON mt.tag_id = t.id
  `;
  return await db.query(queryText);
};

export const returnMealByDayId = async (dayId) => {
  const queryText =
    'SELECT m.name AS meal, t.name AS tags ' +
    'FROM meal_days AS md ' +
    'INNER JOIN meals AS m ON md.meal_id = m.id ' +
    'INNER JOIN meal_tags AS mt ON m.id = mt.meal_id ' +
    'INNER JOIN tags AS t ON mt.tag_id = t.id ';
  return await db.query(queryText + 'WHERE md.day_id = $1', [dayId]);
};
