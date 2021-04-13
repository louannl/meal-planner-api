const Router = require('express-promise-router');
const db = require('../db');

const router = new Router();

module.exports = router;

//GET MEAL/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { rows } = await db.query('SELECT * FROM meals WHERE id = $1', [id]);
  res.send(rows[0]);
});

//GET UNITS
//POST MEAL

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
