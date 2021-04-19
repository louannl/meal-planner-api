const db = require('../db');

exports.parameterise = (values) => {
  let placeholders = [];
  for (let i = 0; i < values.length; i++) {
    placeholders.push(`$${i + 1}`);
  }
  return placeholders.join(', ');
};

exports.parameteriseBrackets = (values) => {
  let placeholders = [];
  for (let i = 0; i < values.length; i++) {
    placeholders.push(`($${i + 1})`);
  }
  return placeholders.join(', ');
};

exports.nameExists = async (name, table) => {
  const { rowCount } = await db.query(
    `SELECT id FROM ${table} WHERE name = $1`,
    [name]
  );
  return rowCount > 0;
};

exports.idExists = async (id, table) => {
  const { rowCount } = await db.query(`SELECT id FROM ${table} WHERE id = $1`, [
    id,
  ]);
  return rowCount > 0;
};

exports.selectAll = async (table) => {
  const { rows, rowCount } = await db.query(`SELECT * FROM ${table}`);
  return { rows, rowCount };
};

exports.selectOne = async (table, id) => {
  const {
    rows,
    rowCount,
  } = await db.query(`SELECT * FROM ${table} WHERE id = ($1)`, [id]);
  return { rows, rowCount };
};

exports.insertOne = async (table, name) => {
  const { rowCount } = await db.query(
    `INSERT INTO ${table} (name) VALUES ($1)`,
    [name]
  );
  return rowCount;
};

exports.insertAll = async (table, names) => {
  const { rowCount } = await db.query(
    `INSERT INTO ${table} (name) VALUES ${this.parameteriseBrackets(names)}`,
    names
  );
  return rowCount;
};

exports.insertAndReturnId = async (table, name) => {
  const {
    rowCount,
    rows,
  } = await db.query(`INSERT INTO ${table} (name) VALUES ($1) RETURNING id`, [
    name,
  ]);
  return { rowCount, id: rows[0]['id'] };
};

exports.updateOne = async (table, id, name) => {
  const {
    rowCount,
  } = await db.query(`UPDATE ${table} SET name = ($1) WHERE id = ($2)`, [
    name,
    id,
  ]);
  return rowCount;
};

exports.deleteOne = async (table, id) => {
  const { rowCount } = await db.query(`DELETE FROM ${table} WHERE id = ($1)`, [
    id,
  ]);
  return rowCount;
};

exports.deleteAll = async (table) => {
  const { rowCount } = await db.query(`DELETE FROM ${table}`);
  return rowCount;
};
