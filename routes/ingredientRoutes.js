import Router from 'express-promise-router';
import { checkSchema } from 'express-validator';
import validate from '../utils/validate.js';
import * as handler from './handler.js';
import * as dbHandlers from '../db/dbHandlers.js';
import * as dbIngredients from '../db/dbIngredients.js';

const router = new Router();
export default router;

handler.getAll(router, 'ingredients');
handler.getOne(router, 'ingredients');
handler.deleteOne(router, 'ingredients');
handler.deleteAll(router, 'ingredients');

router
  .post(
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

      if (await dbHandlers.getExistingNames(name, 'ingredients')) {
        return res.sendStatus(200);
      }

      const rowCount = await dbIngredients.insertIngredient(name, unitTypeId);

      if (rowCount === 1) {
        return res.sendStatus(201);
      }

      res.sendStatus(500);
    }
  )
  .put(
    '/:id',
    validate(
      checkSchema({
        name: {
          errorMessage: 'Name is not valid',
          notEmpty: true,
          in: 'body',
        },
        id: {
          errorMessage: 'ID is not valid',
          notEmpty: true,
          in: 'params',
          isInt: true,
          toInt: true,
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
      const { id } = req.params;
      const { name, unitTypeId } = req.body;

      if (!(await dbHandlers.idExists(id, 'ingredients'))) {
        return res.sendStatus(200);
      }

      if (await dbHandlers.getExistingNames(name, 'ingredients')) {
        return res.sendStatus(200);
      }

      const rowCount = await dbIngredients.updateIngredient(
        name,
        unitTypeId,
        id
      );

      if (rowCount === 1) {
        return res.sendStatus(200);
      }

      res.sendStatus(500);
    }
  );
