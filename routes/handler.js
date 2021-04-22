import { checkSchema } from 'express-validator';
import validate from '../utils/validate.js';
import * as dbHandlers from '../db/dbHandlers.js';

export const getAll = (router, table) => {
  router.get('/', async (req, res) => {
    const { rows, rowCount } = await dbHandlers.selectAll(table);

    if (rowCount === 0) {
      return res.sendStatus(404);
    }

    res.send(rows);
  });
};

export const getOne = (router, table) => {
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
      const { rows, rowCount } = await dbHandlers.selectOne(table, id);

      if (rowCount === 0) {
        return res.sendStatus(404);
      }

      res.send(rows[0]);
    }
  );
};

export const createOne = (router, table) => {
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
      if (await dbHandlers.getExistingNames(name, table)) {
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

export const updateOne = (router, table) => {
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

      if (await dbHandlers.getExistingNames(name, table)) {
        return res.sendStatus(200);
      }

      const rowCount = await dbHandlers.updateOne(table, id, name);

      if (rowCount === 1) {
        return res.status(200).json({
          status: 'success',
          data: {
            //TODO: Add data
          },
        });
      }

      res.sendStatus(500);
    }
  );
};

export const deleteOne = (router, table) => {
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
        res.status(204).json({
          status: 'success',
          data: null,
        });
      }

      res.sendStatus(500);
    }
  );
};

export const deleteAll = (router, table) => {
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
