const db = require('../db');

exports.existingIngredients = async (names) => {
  let placeholders = [];
  for (let i = 0; i < names.length; i++) {
    placeholders.push(`$${i + 1}`);
  }
  const placeholder = placeholders.join(', ');
  const { rows } = await db.query(
    `SELECT name from ingredients WHERE name IN (${placeholder})`,
    names
  );
  return rows;
};
