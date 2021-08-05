import sequelize from '../../sequelize/index.js';
import { getErrorType } from '../../utils/appError.js';

export const getAll = (router, table) => {
  router.get('/', async (req, res) => {
    try {
      const items = await sequelize.models[table].findAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      });

      if (items && items.length) {
        return res.status(200).json({
          status: 'success',
          data: items,
        });
      }

      return res.status(404).send(`No data found in ${table}s`);
    } catch (error) {
      getErrorType(error.parent);
    }
  });
};

export const getById = (router, table) => {
  router.get('/:id', async (req, res) => {
    try {
      const { id } = req.params;

      const items = await sequelize.models[table].findOne({
        where: { id: id },
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
      getErrorType(error.parent);
    }
  });
};

export const create = (router, table) => {
  router.post('/', async (req, res) => {
    try {
      const { name } = req.body;

      await sequelize.models[table].create({
        name: name,
      });

      return res.status(201).json({
        status: 'success',
      });
    } catch (error) {
      getErrorType(error.parent);
    }
  });
};

export const update = (router, table) => {
  router.put('/:id', async (req, res) => {
    const { name } = req.body;
    const { id } = req.params;
    try {
      await sequelize.models[table].update(
        {
          name,
        },
        {
          where: { id },
        }
      );

      return res.status(200).json({
        status: 'success',
      });
    } catch (error) {
      getErrorType(error.parent);
    }
  });
};

export const remove = (router, table) => {
  router.delete('/:id', async (req, res) => {
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
      getErrorType(error.parent);
    }
  });
};
