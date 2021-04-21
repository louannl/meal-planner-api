import Router from 'express-promise-router';
import { getOne, getAll } from './handler.js';
import { createMeal } from '../domain/meals.js';

const router = new Router();
export default router;

//GET MEAL/:id
getOne(router, 'meals');
getAll(router, 'meals');

//GET MEALS BY DAYS
router.get('/');

//('SELECT * from meals_days WHERE day_id = ($1)'), [dayId] )

router.post('/', async (req, res) => {
  const { dayId, mealName, mealTags, ingredients } = req.body;
  return await createMeal(dayId, mealName, mealTags, ingredients);
});
