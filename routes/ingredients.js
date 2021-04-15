const Router = require('express-promise-router');
const { checkSchema } = require('express-validator');
const validate = require('../validation');
const db = require('../db');
const handler = require('./handler');
const checks = require('./checks');

const router = new Router();
module.exports = router;

handler.getAll(router, 'ingredients');
handler.getOne(router, 'ingredients');
handler.deleteOne(router, 'ingredients');
handler.deleteAll(router, 'ingredients');
//ADD INGREDIENT
router.post(
  '/',
  validate(
    checkSchema({
      name: {
        errorMessage: 'Name cannot be empty',
        notEmpty: true,
        in: 'body',
      },
      unit_type_id: {
        errorMessage: 'Ingredient must have a unit type',
        notEmpty: true,
        in: 'body',
      },
    })
  ),
  async (req, res) => {
    const { name } = req.body.name;
    const { unitType } = req.body.unit_type_id;

    if (checks.nameExists(name)) {
      return res.sendStatus(400);
    }

    const {
      rowCount,
    } = await db.query(
      'INSERT INTO ingredients (name, unit_type_id) VALUES ($1, $2)',
      [name, unitType]
    );

    if (rowCount === 1) {
      return res.sendStatus(201);
    }

    res.sendStatus(500);
  }
);

//EDIT INGREDIENT
