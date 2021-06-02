import Router from 'express-promise-router';
import {
  createMeal,
  deleteAllMeals,
  deleteMeal,
  getMealInfo,
  getMealsByDay,
  getMealsWithDay,
  updateMeal,
} from '../domain/meals.js';
//TODO: change this to domainMeals or something
import validate from '../utils/validate.js';
import { checkSchema } from 'express-validator';
import { getErrorType } from '../utils/appError.js';
import { deleteDayByMealId, returnAllMealIngredients } from '../db/dbMeals.js';

const router = new Router();
export default router;

//TODO: Add Route to delete day from a meal. if only one day delete whole meal

router.get('/meal-ingredients', async (req, res) => {
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

router.get('/meals-with-days', async (req, res) => {
  try {
    const rows = await getMealsWithDay();

    res.status(200).json({
      status: 'success',
      data: rows,
    });
  } catch (error) {
    getErrorType(error);
  }
});

router.get(
  '/meals-by-day/:id',
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
      dayIds: {
        errorMessage: 'Day Id is not valid',
        notEmpty: true,
        in: 'body',
        isArray: true,
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
    const { dayIds, mealName, mealTags, ingredients } = req.body;
    try {
      await createMeal(dayIds, mealName, mealTags, ingredients);

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
    const { id } = req.params;
    const { dayIds, mealName, mealTags, ingredients } = req.body;
    try {
      await updateMeal(id, mealName, dayIds, mealTags, ingredients);
      res.status(200).json({
        status: 'success',
      });
    } catch (error) {
      console.log(error);
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

router.delete(
  '/:id/:dayId',
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
      dayId: {
        errorMessage: 'Day ID is not valid',
        notEmpty: true,
        in: 'params',
        isInt: true,
        //sanitizer
        toInt: true,
      },
    })
  ),
  async (req, res) => {
    const { id, dayId } = req.params;
    try {
      await deleteDayByMealId(id, dayId);
      res.status(204).json({
        status: 'success',
      });
    } catch (error) {
      getErrorType(error);
    }
  }
);
