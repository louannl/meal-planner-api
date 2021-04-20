const db = require('../db');

const parameterise = (values, offset = 0) => {
  let placeholders = [];
  for (let i = 0; i < values.length; i++) {
    placeholders.push(`$${i + offset + 1}`);
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

//fix this so I don't have multiple parametise functions
exports.parameteriseAll = (values) => {
  let placeholders = [];
  for (let i = 0; i < values.length; i + 2) {
    placeholders.push(`($${i + 1}, ${i + 2} )`);
  }
  console.log('Parametise is running');
  return placeholders.join(', ');
};

exports.getExistingItems = async (table, names) => {
  const { rows } = await db.query(
    `SELECT name, id from ${table} WHERE name IN (${parameterise(names)})`,
    names
  );

  if (rows === undefined) {
    return [];
  }

  return rows;
};

exports.getExistingIds = async (table, names) => {
  const rows = await this.getExistingItems(table, names);
  return rows.map((row) => row.id);
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

const getColumns = (values) => {
  return Object.keys(values[0]).join(', ');
};

const getValueRows = (values) => {
  return values.map((item) => Object.values(item));
};

const getPlaceholders = (rows) => {
  let queryValues = [];
  let offset = 0;
  for (const row of rows) {
    queryValues.push(`(${parameterise(row, offset)})`);
    offset += row.length;
  }
  return queryValues.join(',');
};

exports.insert = async (table, values) => {
  //need to ensure columns are validated before passed here
  const columns = getColumns(values);
  const placeholderRows = getValueRows(values);
  const placeholders = getPlaceholders(placeholderRows);
  const params = placeholderRows.flat();
  await db.query(
    `INSERT INTO ${table} (${columns}) VALUES ${placeholders}`,
    params
  );
};

exports.insertAndReturnId = async (table, values) => {
  //won't work if inserting more than one.
  const columns = getColumns(values);
  const placeholderRows = getValueRows(values);
  const placeholders = getPlaceholders(placeholderRows);
  const params = placeholderRows.flat();
  const { rowCount, rows } = await db.query(
    `INSERT INTO ${table} (${columns}) VALUES ${placeholders} RETURNING id`,
    params
  );
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
