import Router from 'express-promise-router';
import { checkSchema } from 'express-validator';
import validate from '../../utils/validate.js';
import { MealDay } from '../../sequelize/index.js';
import AppError, { getErrorType } from '../../utils/appError.js';
import { transformDayMeals, transformTagMeals } from '../domain/domainDay.js';
import {
  createMeal,
  deleteMeal,
  transformMealInfo,
  updateMeal,
} from '../domain/domainMeal.js';
import prisma from '../../prisma.js';

const router = new Router();
export default router;

router.get('/meal-ingredients', async (req, res) => {
  try {
    const results = await prisma.$queryRaw`
      SELECT i.name AS ingredient, (SUM(amount))::text AS total, ut.name AS unit 
      FROM meal_ingredients AS mi 
      INNER JOIN ingredients AS i ON mi.ingredient_id = i.id 
      INNER JOIN unit_types AS ut ON mi.unit_type_id = ut.id 
      INNER JOIN meal_days AS md ON mi.meal_id = md.meal_id 
      GROUP BY i.name, ut.name
    `;

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
    const result = await prisma.days.findMany({
      select: {
        id: true,
        name: true,
        meal_days: {
          select: {
            meal_id: true,
            meals: {
              select: {
                name: true,
                meal_tags: { select: { tags: { select: { name: true } } } },
              },
            },
          },
        },
      },
    });

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
      const result = await prisma.days.findUnique({
        where: { id },
        select: {
          meal_days: {
            select: {
              meal_id: true,
              meals: {
                select: {
                  name: true,
                  meal_tags: { select: { tags: { select: { name: true } } } },
                },
              },
            },
          },
        },
      });

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

      const result = await prisma.meals.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          meal_days: {
            select: { day_id: true },
          },
          meal_tags: {
            select: { tags: { select: { name: true } } },
          },
          meal_ingredients: {
            select: {
              ingredient_id: true,
              ingredients: { select: { name: true } },
              amount: true,
              unit_types: { select: { name: true } },
            },
          },
        },
      });

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

// DELETE a DAY from the meal
router.delete(
  '/:mealId/:dayId',
  validate(
    checkSchema({
      mealId: {
        errorMessage: 'Meal ID is not valid',
        notEmpty: true,
        in: 'params',
        isInt: true,
        // sanitizer
        toInt: true,
      },
      dayId: {
        errorMessage: 'Day ID is not valid',
        notEmpty: true,
        in: 'params',
        isInt: true,
        // sanitizer
        toInt: true,
      },
    }),
  ),
  async (req, res) => {
    const { mealId, dayId } = req.params;
    try {
      const days = await MealDay.findAll({
        where: { meal_id: mealId },
      });

      // If the dayId doesn't exist in the table -> do nothing
      if (!days.some((entry) => entry.day_id === dayId)) {
        return res.status(204).json({
          status: 'success',
        });
      }

      // If there are multiple days, only delete the specific day
      if (days.length > 1) {
        await MealDay.destroy({
          where: {
            meal_id: mealId,
            day_id: dayId,
          },
        });

        return res.status(204).json({
          status: 'success',
        });
      }

      // If the day is the last day in the table, delete the entire meal:
      await deleteMeal(mealId);

      return res.status(204).json({
        status: 'success',
      });
    } catch (error) {
      return getErrorType(error, 'Meal');
    }
  },
);
