const Router = require('express-promise-router');
const handler = require('./handler');

const router = new Router();
module.exports = router;

//GET MEAL/:id
handler.getOne(router, 'meals');
handler.getAll(router, 'meals');

//GET UNITS
//POST MEAL
// add day_meals record
// add ingredients to DB, check if ingredient already exists
// add ingredients to meal via meal_ingredients

//PUT MEAL/:id
//DELETE MEAL/:id
//GET ALL INGREDIENTS
//GET ALL MEALS
