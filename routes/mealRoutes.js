const Router = require('express-promise-router');
const handler = require('./handler');
const db = require('../db');

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
  //create meal with id
  //check ingredients to db if exists
  //map
  const names = ingredients.map((ingredient) => ingredient.name);

  //database function(names) =>
  let placeholders = [];
  for (let i = 0; i < names.length; i++) {
    placeholders.push(`$${i + 1}`);
  }
  const placeholder = placeholders.join(', ');
  const { rows } = await db.query(
    `SELECT name from ingredients WHERE name IN (${placeholder})`,
    names
  );
  //returns list to domain

  const existingIngredients = rows.map((ingredient) => ingredient.name);
  const missingIngredients = names.filter(
    (ingredient) => !existingIngredients.includes(ingredient)
  );

  return console.log(missingIngredients);
  //create ingredients if they do not exist
  //post to ingredients
  //then insert meal_ingredient for each ingredient
  /*
  db.query(
    'INSERT INTO meal_ingredients (mealId, ingredientId, amount, unitType) VALUES ($1, $2, $3, $4)',
    [mealId, ingredientId, amount, unitType]
  );
  */
  //return res.sendStatus(200), console.log(...ingredients);

  //ingredients - check exists, create new if not, then add
});

//INPUT SELECT DAY
//INPUT MEAL NAME
//INPUT MEAL TAG (OPTIONAL)
//ADD INGREDIENTS ---
//INPUT INGREDIENT NAME
//INPUT INGREDIENT AMOUNT
//INPUT INGREDIENT UNITTYPE
//ADD MULTIPLE
//ADD COMMENT

//GET MEALS (WITH COMMENTS) BY DAY

//GET UNITS
//POST MEAL
// add day_meals record
// add ingredients to DB, check if ingredient already exists
// add ingredients to meal via meal_ingredients

//PUT MEAL/:id
//DELETE MEAL/:id
//GET ALL INGREDIENTS
//GET ALL MEALS
