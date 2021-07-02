import sequelize from '../../sequelize/index.js';

export const getAll = (router, table) => {
  router.get('/', async (req, res) => {
    try {
      console.log(sequelize.models[table]);
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
