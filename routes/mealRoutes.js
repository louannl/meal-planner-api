const Router = require('express-promise-router');
const handler = require('./handler');
const meals = require('../domain/meals');

const router = new Router();
module.exports = router;

//GET MEAL/:id
handler.getOne(router, 'meals');
handler.getAll(router, 'meals');

//GET MEALS BY DAYS
router.get('/');

//('SELECT * from meals_days WHERE day_id = ($1)'), [dayId] )

router.post('/', async (req, res) => {
  const { dayId, mealName, mealTag, ingredients } = req.body;
  return await meals.createMeal(dayId, mealName, mealTag, ingredients);
});
