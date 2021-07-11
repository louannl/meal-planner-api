import sequelize from '../../sequelize/index.js';

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
      return res.status(500).send(error.message);
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
      return res.status(500).send(error.message);
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
      return res.status(500).send(error.message);
    }
  });
};

// export const update

export const remove = (router, table) => {
  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await sequelize.models[table].destroy({
        where: {
          id: id,
        },
      });
      return res.status(204).json({
        status: 'success',
      });
    } catch (error) {
      return res.status(500).send(error.message);
    }
  });
};

export const removeByName = (router, table) => {
  router.delete(`/delete-${table}`, async (req, res) => {
    try {
      const { name } = req.body;
      await sequelize.models[table].destroy({
        where: {
          name: name,
        },
      });
      return res.status(204).json({
        status: 'success',
      });
    } catch (error) {
      return res.status(500).send(error.message);
    }
  });
};
