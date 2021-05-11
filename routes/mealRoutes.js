import Router from 'express-promise-router';
import { getOne, getAll } from './routeHandler.js';
import {
  createMeal,
  deleteAllMeals,
  deleteMeal,
  getMealInfo,
  getMealsByDay,
  getMealswithDay,
  updateMeal,
} from '../domain/meals.js';
//TODO: change this to domainMeals or something
import validate from '../utils/validate.js';
import { checkSchema } from 'express-validator';
import { getErrorType } from '../utils/appError.js';
import { returnAllMealIngredients } from '../db/dbMeals.js';

const router = new Router();
export default router;

router.get('/mealingredients', async (req, res) => {
  try {
    const { rows } = await returnAllMealIngredients();

    res.status(200).json({
      status: 'success',
      data: rows,
    });
  } catch (error) {
    getErrorType(error);
  }
});

router.get('/mealswithdays', async (req, res) => {
  try {
    const rows = await getMealswithDay();

    res.status(200).json({
      status: 'success',
      data: rows,
    });
  } catch (error) {
    getErrorType(error);
  }
});

router.get(
  '/mealsbyday/:id',
  validate(
    checkSchema({
      id: {
        errorMessage: 'ID is not valid',
        notEmpty: true,
        in: 'params',
        isInt: true,
        toInt: true,
      },
    })
  ),
  async (req, res) => {
    try {
      const { id } = req.params;
      const rows = await getMealsByDay(id);

      res.status(200).json({
        status: 'success',
        data: rows,
      });
    } catch (error) {
      getErrorType(error);
    }
  }
);

router.get(
  '/:id',
  validate(
    checkSchema({
      id: {
        errorMessage: 'ID is not valid',
        notEmpty: true,
        in: 'params',
        isInt: true,
        toInt: true,
      },
    })
  ),
  async (req, res) => {
    try {
      const { id } = req.params;
      const rows = await getMealInfo(id);

      res.status(200).json({
        status: 'success',
        data: rows,
      });
    } catch (error) {
      getErrorType(error);
    }
  }
);

router.post(
  '/',
  validate(
    checkSchema({
      mealName: {
        errorMessage: 'Name cannot be empty',
        notEmpty: true,
        in: 'body',
      },
      dayId: {
        errorMessage: 'Day Id is not valid',
        notEmpty: true,
        in: 'body',
        isInt: true,
        toInt: true,
      },
      mealTags: {
        errorMessage: 'MealTag must be an array',
        isArray: true,
        in: 'body',
      },
      ingredients: {
        errorMessage: 'ingredients must be an array',
        isArray: true,
      },
      'ingredients.*.name': {
        notEmpty: true,
      },
      'ingredients.*.amount': {
        notEmpty: true,
        isInt: true,
        toInt: true,
      },
      'ingredients.*.unitType': {
        errorMessage: 'unitType must exist',
        notEmpty: true,
        isInt: true,
        toInt: true,
      },
    })
  ),
  async (req, res) => {
    const { dayId, mealName, mealTags, ingredients } = req.body;
    try {
      await createMeal(dayId, mealName, mealTags, ingredients);

      res.status(201).json({
        status: 'success',
      });
    } catch (error) {
      getErrorType(error);
    }
  }
);

router.put(
  '/:id',
  validate(
    checkSchema({
      mealName: {
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
    })
  ),
  async (req, res) => {
    //TODO: change later
    const { id } = req.params;
    const { dayId, mealName, mealTags, ingredients } = req.body;
    try {
      await updateMeal(id, mealName, dayId, mealTags, ingredients);
      res.status(200).json({
        status: 'success',
      });
    } catch (error) {
      getErrorType(error);
    }
  }
);

router.delete(
  '/:id',
  validate(
    checkSchema({
      id: {
        errorMessage: 'ID is not valid',
        notEmpty: true,
        in: 'params',
        isInt: true,
        //sanitizer
        toInt: true,
      },
    })
  ),
  async (req, res) => {
    const { id } = req.params;
    try {
      await deleteMeal(id);

      res.status(204).json({
        status: 'success',
      });
    } catch (error) {
      getErrorType(error);
    }
  }
);

router.delete('/', async (req, res) => {
  try {
    await deleteAllMeals();

    res.status(204).json({
      status: 'success',
    });
  } catch (error) {
    getErrorType(error);
  }
});
