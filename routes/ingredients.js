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
      unitTypeId: {
        errorMessage: 'Unit ID is not valid',
        notEmpty: true,
        in: 'body',
        isInt: true,
        //sanitizer
        toInt: true,
      },
    })
  ),
  async (req, res) => {
    const { name, unitTypeId } = req.body;

    if (await checks.nameExists(name, 'ingredients')) {
      return res.sendStatus(200);
    }

    const {
      rowCount,
    } = await db.query(
      'INSERT INTO ingredients (name, unit_type_id) VALUES ($1, $2)',
      [name, unitTypeId]
    );

    if (rowCount === 1) {
      return res.sendStatus(201);
    }

    res.sendStatus(500);
  }
);

//EDIT INGREDIENT
