const Router = require('express-promise-router');
const handler = require('./handler');

const router = new Router();
module.exports = router;

//GET MEAL/:id
handler.getOne(router, 'meals');
handler.getAll(router, 'meals');

//GET UNITS
//POST MEAL
const createMeal = (req, res) => {
  const { name, dayId } = req.body;

  pool.query(
    'INSERT INTO meals (name) VALUES ($1)',
    [name],
    (error, result) => {
      if (error) {
        throw error;
      }
      const mealId = result.insertId;
      // add day_meals record
      pool.query(
        'INSERT INTO day_meals (meal_id, day_id) VALUES ($1, $2)',
        [mealId, dayId],
        (error, result) => {
          if (error) {
            throw error;
          }
        }
      );
      // add ingredients to DB, check if ingredient already exists

      // add ingredients to meal via meal_ingredients

      res.status(201).send(`Meal added with ID: ${result.insertId}`);
    }
  );
};
//PUT MEAL/:id
//DELETE MEAL/:id
//GET ALL INGREDIENTS
//GET ALL MEALS
const getMeals = (req, res) => {
  pool.query('SELECT * FROM meals', (err, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
};
