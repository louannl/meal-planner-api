import { checkSchema } from 'express-validator';
import validate from '../../utils/validate.js';
import { getErrorType } from '../../utils/appError.js';
import {
  createName, deleteById, findById, findMany, updateName,
} from '../db/generic.js';

export const getAll = (router, table) => {
  router.get('/', async (req, res) => {
    try {
      return res.status(200).json({
        status: 'success',
        data: await findMany(table),
      });
    } catch (error) {
      return getErrorType(error, table);
    }
  });
};

export const getById = (router, table) => {
  router.get(
    '/:id',
    validate(
      checkSchema({
        id: {
          errorMessage: 'ID is not valid',
          notEmpty: true,
          in: 'params',
          isInt: true,
          toInt: true,
        },
      }),
    ),
    async (req, res) => {
      try {
        const { id } = req.params;

        const result = await findById(table, id);

        if (!result) {
          const tableText = (table[0].toUpperCase() + table.slice(1).toLowerCase()).slice(0, -1);
          return res
            .status(404)
            .send(`${tableText} with the specified ID does not exist`);
        }

        return res.status(200).json({
          status: 'success',
          data: result,
        });
      } catch (error) {
        return getErrorType(error, table);
      }
    },
  );
};

export const create = (router, table) => {
  router.post(
    '/',
    validate(
      checkSchema({
        name: {
          errorMessage: 'Name cannot be empty',
          notEmpty: true,
          in: 'body',
        },
      }),
    ),
    async (req, res) => {
      try {
        const { name } = req.body;

        await createName(table, name);

        return res.status(201).json({
          status: 'success',
        });
      } catch (error) {
        return getErrorType(error, table);
      }
    },
  );
};

export const update = (router, table) => {
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
      }),
    ),
    async (req, res) => {
      const { name } = req.body;
      const { id } = req.params;

      try {
        await updateName(table, name, id);

        return res.status(200).json({
          status: 'success',
        });
      } catch (error) {
        return getErrorType(error, table);
      }
    },
  );
};

export const remove = (router, table) => {
  router.delete(
    '/:id',
    validate(
      checkSchema({
        id: {
          errorMessage: 'ID is not valid',
          notEmpty: true,
          in: 'params',
          isInt: true,
          toInt: true,
        },
      }),
    ),
    async (req, res) => {
      const { id } = req.params;
      try {
        await deleteById(table, id);

        return res.status(204).json({
          status: 'success',
        });
      } catch (error) {
        return getErrorType(error, table);
      }
    },
  );
};
