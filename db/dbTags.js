const db = require('.');

exports.createAllMealTags = async (placeholder, params) => {
  const { rowCount } = await db.query(
    `INSERT INTO meal_tags (meal_id, tag_id) VALUES ${placeholder}`,
    params
  );
  return rowCount;
};
