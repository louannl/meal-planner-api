import AppError from '../utils/appError.js.js';
import db from './index.js';

const parameterise = (values, offset = 0) => {
  let placeholders = [];
  for (let i = 0; i < values.length; i++) {
    placeholders.push(`$${i + offset + 1}`);
  }
  return placeholders.join(', ');
};

export const getExistingItems = async (table, names) => {
  const { rows } = await db.query(
    `SELECT name, id from ${table} WHERE name IN (${parameterise(names)})`,
    names
  );

  if (rows === undefined) {
    return [];
  }

  return rows;
};

export const getExistingIds = async (table, names) => {
  const rows = await getExistingItems(table, names);
  return rows.map((row) => row.id);
};

export const getExistingNames = async (name, table) => {
  const { rowCount } = await db.query(
    `SELECT id FROM ${table} WHERE name = $1`,
    [name]
  );
  return rowCount > 0;
};

export const idExists = async (id, table) => {
  const { rowCount } = await db.query(`SELECT id FROM ${table} WHERE id = $1`, [
    id,
  ]);
  return rowCount > 0;
};

export const selectAll = async (table) => {
  const { rows, rowCount } = await db.query(`SELECT * FROM ${table}`);
  if (!rows) {
    throw new AppError('No data found', 404);
  }
  return { rows, rowCount };
};

export const selectOne = async (table, id) => {
  const {
    rows,
    rowCount,
  } = await db.query(`SELECT * FROM ${table} WHERE id = ($1)`, [id]);
  return { rows, rowCount };
};

export const insertOne = async (table, name) => {
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

export const insert = async (table, values) => {
  //need to ensure columns are validated before passed here
  const columns = getColumns(values);
  const placeholderRows = getValueRows(values);
  const placeholders = getPlaceholders(placeholderRows);
  const params = placeholderRows.flat();
  const { rows } = await db.query(
    `INSERT INTO ${table} (${columns}) VALUES ${placeholders}`,
    params
  );
  if (!rows) {
    throw new AppError('Failed to create data', 400);
  }
};

export const insertAndReturnId = async (table, values) => {
  //TODO: won't work if inserting more than one.
  const columns = getColumns(values);
  const placeholderRows = getValueRows(values);
  const placeholders = getPlaceholders(placeholderRows);
  const params = placeholderRows.flat();
  const { rows } = await db.query(
    `INSERT INTO ${table} (${columns}) VALUES ${placeholders} RETURNING id`,
    params
  );
  if (!rows) {
    throw new AppError('Failed to create data', 400);
  }
  return { id: rows[0]['id'] };
};

export const updateOne = async (table, id, name) => {
  const {
    rowCount,
  } = await db.query(`UPDATE ${table} SET name = ($1) WHERE id = ($2)`, [
    name,
    id,
  ]);
  return rowCount;
};

export const deleteOne = async (table, id) => {
  const { rowCount } = await db.query(`DELETE FROM ${table} WHERE id = ($1)`, [
    id,
  ]);
  if (!rowCount) {
    throw new AppError('No data to delete', 404);
  }
  return rowCount;
};

//TODO: delete all with same mealid?
export const deleteAll = async (table) => {
  const { rowCount } = await db.query(`DELETE FROM ${table}`);
  if (!rowCount) {
    throw new AppError('No data to delete', 404);
  }
  return rowCount;
};
