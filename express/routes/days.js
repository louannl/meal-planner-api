import sequelize from '../../sequelize/index.js';

import Router from 'express-promise-router';

const router = new Router();
export default router;

router.get('/', async (req, res) => {
  const days = await sequelize.models.Day.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });
  res.status(200).json(days);
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const day = await sequelize.models.Day.findOne({
      where: { id: id },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });

    if (day) {
      return res.status(200).json({ day });
    }

    return res.status(404).send('Day with the specified ID does not exist');
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

// export const getAll = async (req, res) => {
//   const users = await models.days.findAll();
//   res.status(200).json(users);
// };
