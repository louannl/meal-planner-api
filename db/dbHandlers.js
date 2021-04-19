const db = require('../db');

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

exports.selectAll = (table) => {
    const { rows, rowCount } = await db.query(`SELECT * FROM ${table}`);
    return rows, rowCount;
}

exports.selectOne = (table, id) => {
    const {
        rows,
        rowCount,
      } = await db.query(`SELECT * FROM ${table} WHERE id = ($1)`, [id]);
    return rows, rowCount;
}

exports.insertOne = (table, name) => {
    const {
        rowCount,
      } = await db.query(`INSERT INTO ${table} (name) VALUES ($1)`, [name]);
    return rowCount;
}

exports.updateOne = (table, id, name) => {
    const {
        rowCount,
      } = await db.query(`UPDATE ${table} SET name = ($1) WHERE id = ($2)`, [
        name,
        id,
      ]);
    return rowCount;
}

exports.deleteOne = (table, id) => {
    const {
        rowCount,
      } = await db.query(`DELETE FROM ${table} WHERE id = ($1)`, [id]);
    return rowCount;
}