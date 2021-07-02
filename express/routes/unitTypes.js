import sequelize from '../../sequelize/index.js';

import Router from 'express-promise-router';

const router = new Router();
export default router;

router.get('/', async (req, res) => {
  const units = await sequelize.models.UnitType.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });
  res.status(200).json(units);
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const unitType = await sequelize.models.UnitType.findOne({
      where: { id: id },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });

    if (unitType) {
      return res.status(200).json({ unitType });
    }

    return res
      .status(404)
      .send('Unit-type with the specified ID does not exist');
  } catch (error) {
    return res.status(500).send(error.message);
  }
});
