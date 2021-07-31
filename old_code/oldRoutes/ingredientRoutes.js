import Router from 'express-promise-router';
import { checkSchema } from 'express-validator';
import validate from '../utils/validate.js';
import * as handler from './routeHandler.js';
import * as dbHandlers from '../db/dbHandlers.js';
import { getErrorType } from '../utils/appError.js';
import { deleteIngredient } from '../domain/ingredients.js';

const router = new Router();
export default router;

handler.getAll(router, 'ingredients');
handler.getOne(router, 'ingredients');

router.post(
  '/',
  validate(
    checkSchema({
      name: {
        errorMessage: 'Name cannot be empty',
        notEmpty: true,
        isString: true,
        in: 'body',
      },
    })
  ),
  async (req, res) => {
    const { name } = req.body;
    try {
      dbHandlers.insert('ingredients', [{ name: name }]);
      res.status(201).json({
        status: 'success',
      });
    } catch (error) {
      getErrorType(error);
    }
  }
);

router.put(
  '/',
  validate(
    checkSchema({
      name: {
        errorMessage: 'Name is not valid',
        notEmpty: true,
        isString: true,
        in: 'body',
      },
      newName: {
        errorMessage: 'New name is not valid',
        notEmpty: true,
        isString: true,
        in: 'body',
      },
    })
  ),
  async (req, res) => {
    const { name, newName } = req.body;

    try {
      await dbHandlers.updateName('ingredients', newName, name);
      res.status(200).json({
        status: 'success',
      });
    } catch (error) {
      getErrorType(error);
    }
  }
);

router.delete(
  '/delete-ingredient',
  validate(
    checkSchema({
      name: {
        errorMessage: 'Ingredient name is not valid',
        notEmpty: true,
        in: 'body',
      },
    })
  ),
  async (req, res) => {
    const { name } = req.body;
    try {
      await deleteIngredient(name);
      res.status(204).json({
        status: 'success',
      });
    } catch (error) {
      getErrorType(error);
    }
  }
);
