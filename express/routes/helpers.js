import { checkSchema } from 'express-validator';
import sequelize from '../../sequelize/index.js';
import validate from '../../utils/validate.js';
import { getErrorType } from '../../utils/appError.js';
import { createName, updateName } from '../domain/domainHelper.js';

export const getAll = (router, table) => {
  router.get('/', async (req, res) => {
    try {
      return res.status(200).json({
        status: 'success',
        data: await sequelize.models[table].findAll({
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        }),
      });
    } catch (error) {
      getErrorType(error, table);
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

        const items = await sequelize.models[table].findOne({
          where: { id },
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        });

        if (items) {
          return res.status(200).json({
            status: 'success',
            data: items,
          });
        }

        return res
          .status(404)
          .send(`${table} with the specified ID does not exist`);
      } catch (error) {
        getErrorType(error, table);
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
        getErrorType(error, table);
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
        const rowsUpdated = await updateName(table, name, id);

        if (rowsUpdated[0] === 0) {
          return res.status(404).send('Item does not exist');
        }

        return res.status(200).json({
          status: 'success',
        });
      } catch (error) {
        getErrorType(error, table);
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
          // sanitizer
          toInt: true,
        },
      }),
    ),
    async (req, res) => {
      const { id } = req.params;
      try {
        await sequelize.models[table].destroy({
          where: {
            id,
          },
        });
        return res.status(204).json({
          status: 'success',
        });
      } catch (error) {
        getErrorType(error, table);
      }
    },
  );
};
