import sequelize from '../../sequelize/index.js';

import Router from 'express-promise-router';

const router = new Router();
export default router;

router.get('/', async (req, res) => {
  const days = await sequelize.models.Day.findAll();
  res.status(200).json(days);
});

// export const getAll = async (req, res) => {
//   const users = await models.days.findAll();
//   res.status(200).json(users);
// };
