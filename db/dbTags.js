const db = require('.');

exports.insertAllMealTags = async (placeholder, params) => {
  const { rowCount } = await db.query(
    `INSERT INTO meal_tags (meal_id, tag_id) VALUES ${placeholder}`,
    params
  );
  return rowCount;
};

exports.insertMealTags = async (mealId, tagId) => {
  await db.query('INSERT INTO meal_tags (meal_id, tag_id) VALUES ($1, $2)', [
    mealId,
    tagId,
  ]);
};
