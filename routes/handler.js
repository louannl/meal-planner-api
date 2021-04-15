const { checkSchema } = require('express-validator');
const validate = require('../validation');
const db = require('../db');

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
