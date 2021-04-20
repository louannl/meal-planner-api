const db = require('../db');

exports.createMealDay = async (mealId, dayId) => {
  await db.query('INSERT INTO meal_days (meal_id, day_id) VALUES ($1, $2)', [
    mealId,
    dayId,
  ]);
};
