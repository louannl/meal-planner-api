import Router from 'express-promise-router';
import { checkSchema } from 'express-validator';
import validate from '../../utils/validate.js';
import AppError, { getErrorType } from '../../utils/appError.js';
import { transformDayMeals, transformTagMeals } from '../domain/dayTransformers.js';
import transformMealInfo from '../domain/mealTransformer.js';
import {
  createMeal, updateMeal, deleteMeal, getMealById,
} from '../db/meal.js';
import { getSummarisedIngredients } from '../db/mealIngredients.js';
import { getMealsByDay, getMealsWithDays } from '../db/mealDays.js';

const router = new Router();
export default router;

router.get('/meal-ingredients', async (req, res) => {
  try {
    const results = await getSummarisedIngredients();

    return res.status(200).json({
      status: 'success',
      data: results,
    });
  } catch (error) {
    return getErrorType(error, 'Ingredients');
  }
});

router.get('/meals-with-days', async (req, res) => {
  try {
    const result = await getMealsWithDays();

    return res.status(200).json({
      status: 'success',
      data: transformDayMeals(result),
    });
  } catch (error) {
    return getErrorType(error, 'Day');
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
    }),
  ),
  async (req, res) => {
    const { id } = req.params;
    try {
      const result = await getMealsByDay(id);

      return res.status(200).json({
        status: 'success',
        data: transformTagMeals(result.meal_days),
      });
    } catch (error) {
      return getErrorType(error, 'Day');
    }
  },
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
    }),
  ),
  async (req, res) => {
    try {
      const { id } = req.params;

      const result = await getMealById(id);

      if (result === null) {
        return res
          .status(404)
          .send('Meal with the specified ID does not exist');
      }

      const mealData = transformMealInfo(result);

      return res.status(200).json({
        status: 'success',
        data: mealData,
      });
    } catch (error) {
      return getErrorType(error, 'Meal');
    }
  },
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
        notEmpty: true,
      },
      'ingredients.*.name': {
        notEmpty: true,
        isString: true,
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
    }),
  ),
  async (req, res) => {
    const { dayIds, ingredients } = req.body;
    // FIXME: If items are missing, it throws an error it is not iterable
    // Which is not very informative.
    try {
      // TODO: There should be a nicer way to implement these validations
      // TODO: If one item is not valid it'll hit a 500 error instead of validation
      if (ingredients.length === 0) {
        throw new AppError('Ingredients cannot be empty', 400);
      }

      if (dayIds.length === 0) {
        throw new AppError('Days cannot be empty', 400);
      }

      await createMeal(req.body);

      return res.status(201).json({
        status: 'success',
      });
    } catch (error) {
      return getErrorType(error, 'Meal');
    }
  },
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
        notEmpty: true,
      },
      'ingredients.*.name': {
        notEmpty: true,
        isString: true,
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
    }),
  ),
  async (req, res) => {
    const { id: mealId } = req.params;

    try {
      await updateMeal(req.body, mealId);

      return res.status(200).json({
        status: 'success',
      });
    } catch (error) {
      return getErrorType(error, 'Meal');
    }
  },
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
        // sanitizer
        toInt: true,
      },
    }),
  ),
  async (req, res) => {
    const { id } = req.params;
    try {
      await deleteMeal(id);

      return res.status(204).json({
        status: 'success',
      });
    } catch (error) {
      return getErrorType(error, 'Meal');
    }
  },
);

// TODO: DELETE / All meals
