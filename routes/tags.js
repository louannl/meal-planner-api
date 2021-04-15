const { checkSchema } = require('express-validator');
const validate = require('../validation');
const Router = require('express-promise-router');
const db = require('../db');

const tagNameExists = async (name) => {
  const { rowCount } = await db.query('SELECT id FROM tags WHERE name = $1', [
    name,
  ]);
  return rowCount > 0;
};

const tagIdExists = async (id) => {
  const { rowCount } = await db.query('SELECT id FROM tags WHERE id = $1', [
    id,
  ]);
  return rowCount > 0;
};

const router = new Router();
module.exports = router;

router
  .get(
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
      const {
        rows,
        rowCount,
      } = await db.query('SELECT * FROM tags WHERE id = $1', [id]);

      if (rowCount === 0) {
        return res.sendStatus(404);
      }

      res.send(rows[0]);
    }
  )
  .post(
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
      if (await tagNameExists(name)) {
        return res.sendStatus(200);
      }

      const { rowCount } = await db.query(
        'INSERT INTO tags (name) VALUES ($1)',
        [name]
      );

      if (rowCount === 1) {
        return res.sendStatus(201);
      }

      res.sendStatus(500);
    }
  )
  .put(
    '/:id',
    validate(
      checkSchema({
        name: {
          errorMessage: 'Name is not valid',
          notEmpty: true,
          in: 'body',
        },
        id: {
          errorMessage: 'ID is not valid',
          notEmpty: true,
          in: 'params',
          isInt: true,
          toInt: true,
        },
      })
    ),
    async (req, res) => {
      const { id } = req.params;
      const { name } = req.body;

      if (!(await tagIdExists(id))) {
        return res.sendStatus(200);
      }

      if (await tagNameExists(name)) {
        return res.sendStatus(200);
      }

      const {
        rowCount,
      } = await db.query('UPDATE tags SET name = ($1) WHERE id = ($2)', [
        name,
        id,
      ]);

      if (rowCount === 1) {
        return res.sendStatus(200);
      }

      res.sendStatus(500);
    }
  )
  .delete(
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

      if (!(await tagIdExists(id))) {
        return res.sendStatus(200);
      }

      const { rowCount } = await db.query('DELETE FROM tags WHERE id = ($1)', [
        id,
      ]);

      if (rowCount === 1) {
        return res.sendStatus(200);
      }

      res.sendStatus(500);
    }
  );
