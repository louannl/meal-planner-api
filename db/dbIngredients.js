const db = require('../db');

exports.insertIngredient = async (name, unitTypeId) => {
  const {
    rowCount,
  } = await db.query(
    'INSERT INTO ingredients (name, unit_type_id) VALUES ($1, $2)',
    [name, unitTypeId]
  );
  return rowCount;
};

exports.updateIngredient = async (name, unitTypeId, id) => {
  const {
    rowCount,
  } = await db.query(
    `UPDATE ingredients SET name = $1, unit_type_id = $2 WHERE id = $3`,
    [name, unitTypeId, id]
  );
  return rowCount;
};
