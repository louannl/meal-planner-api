const { checkSchema } = require('express-validator');
const validate = require('../validation');
const db = require('../db');

const tagNameExists = async (name, table) => {
  const { rowCount } = await db.query(
    `SELECT id FROM ${table} WHERE name = $1`,
    [name]
  );
  return rowCount > 0;
};

const tagIdExists = async (id, table) => {
  const { rowCount } = await db.query(`SELECT id FROM ${table} WHERE id = $1`, [
    id,
  ]);
  return rowCount > 0;
};

exports.getAll = (router, table) => {
  router.get('/', async (req, res) => {
    const { rows, rowCount } = await db.query(`SELECT * FROM ${table}`);

    if (rowCount === 0) {
      return res.sendStatus(404);
    }

    res.send(rows);
  });
};

exports.getOne = (router, table) => {
  router.get(
    '/:id',
    validate(
      checkSchema({
        id: {
          errorMessage: 'ID is not valid',
          notEmpty: true,
          in: 'params',
          isInt: true,
          //sanitizer
          toInt: true,
        },
      })
    )
  ),
    async (req, res) => {
      const { id } = req.params;
      const {
        rows,
        rowCount,
      } = await db.query('SELECT * FROM ($1) WHERE id = ($2)', [table, id]);

      if (rowCount === 0) {
        return res.sendStatus(404);
      }

      res.send(rows[0]);
    };
};

exports.createOne = (router, table) => {
  router.post(
    '/',
    validate(
      checkSchema({
        name: {
          errorMessage: 'Name cannot be empty',
          notEmpty: true,
          in: 'body',
        },
      })
    ),
    async (req, res) => {
      const { name } = req.body;
      if (await tagNameExists(name, table)) {
        return res.sendStatus(200);
      }

      const {
        rowCount,
      } = await db.query(`INSERT INTO ${table} (name) VALUES ($1)`, [name]);

      if (rowCount === 1) {
        return res.sendStatus(201);
      }

      res.sendStatus(500);
    }
  );
};

exports.deleteOne = (router, table) => {
  router.delete(
    '/:id',
    validate(
      checkSchema({
        id: {
          errorMessage: 'ID is not valid',
          notEmpty: true,
          in: 'params',
          isInt: true,
          //sanitizer
          toInt: true,
        },
      })
    ),
    async (req, res) => {
      const { id } = req.params;

      if (!(await tagIdExists(id, table))) {
        return res.sendStatus(200);
      }

      const {
        rowCount,
      } = await db.query(`DELETE FROM ${table} WHERE id = ($1)`, [id]);

      if (rowCount === 1) {
        return res.sendStatus(200);
      }

      res.sendStatus(500);
    }
  );
};
