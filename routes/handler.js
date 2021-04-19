const { checkSchema } = require('express-validator');
const validate = require('../validation');
const dbHandlers = require('../db/dbHandlers');

exports.getAll = (router, table) => {
  router.get('/', async (req, res) => {
    const selects = await dbHandlers.selectAll(table);
    rows = selects[0];
    rowCount = selects[1];

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
    ),
    async (req, res) => {
      const { id } = req.params;
      const selects = await dbHandlers.selectOne(table, id);
      rows = selects[0];
      rowCount = selects[1];

      if (rowCount === 0) {
        return res.sendStatus(404);
      }

      res.send(rows[0]);
    }
  );
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
      if (await dbHandlers.nameExists(name, table)) {
        return res.sendStatus(200);
      }

      const rowCount = await dbHandlers.insertOne(table, name);

      if (rowCount === 1) {
        return res.sendStatus(201);
      }

      res.sendStatus(500);
    }
  );
};

exports.updateOne = (router, table) => {
  router.put(
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

      if (!(await dbHandlers.idExists(id, table))) {
        return res.sendStatus(200);
      }

      if (await dbHandlers.nameExists(name, table)) {
        return res.sendStatus(200);
      }

      const rowCount = await dbHandlers.updateOne(table, id, name);

      if (rowCount === 1) {
        return res.sendStatus(200);
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

      if (!(await dbHandlers.idExists(id, table))) {
        return res.sendStatus(200);
      }

      const rowCount = await dbHandlers.deleteOne(table, id);

      if (rowCount === 1) {
        return res.sendStatus(200);
      }

      res.sendStatus(500);
    }
  );
};

exports.deleteAll = (router, table) => {
  router.delete('/', async (req, res) => {
    const rowCount = await dbHandlers.deleteAll(table);

    if (rowCount) {
      return res.sendStatus(200);
    }

    if (rowCount === 0) {
      return res.sendStatus(404);
    }

    res.sendStatus(500);
  });
};
