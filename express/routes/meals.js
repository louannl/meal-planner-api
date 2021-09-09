import Router from 'express-promise-router';
import sequelize, {
  Meal,
  Day,
  MealIngredient,
  Ingredient,
  UnitType,
  MealDay,
} from '../../sequelize/index.js';
import AppError, { getErrorType } from '../../utils/appError.js';
import { transformDayMeals, transformTagMeals } from '../domain/domainDay.js';
import { transformMealIngredients } from '../domain/domainIngredients.js';
import {
  createMeal,
  deleteMeal,
  transformMealInfo,
  updateMeal,
} from '../domain/domainMeal.js';

const router = new Router();
export default router;

router.get('/meal-ingredients', async (req, res) => {
  try {
    const result = await MealIngredient.findAll({
      group: ['unit_type_id', 'UnitType.id', 'Ingredient.id', 'ingredient_id'],
      include: [
        {
          model: Ingredient,
          attributes: { exclude: ['createdAt', 'updatedAt', 'id'] },
        },
        {
          model: UnitType,
          attributes: { exclude: ['createdAt', 'updatedAt', 'id'] },
        },
      ],
      attributes: {
        include: [[sequelize.fn('SUM', sequelize.col('amount')), 'total']],
        exclude: ['createdAt', 'updatedAt', 'meal_id', 'amount'],
      },
    });

    return res.status(200).json({
      status: 'success',
      data: transformMealIngredients(result),
    });
  } catch (error) {
    getErrorType(error, 'Ingredients');
  }
});

router.get('/meals-with-days', async (req, res) => {
  try {
    const result = await Day.scope('dayMeal').findAll();

    return res.status(200).json({
      status: 'success',
      data: transformDayMeals(result),
    });
  } catch (error) {
    getErrorType(error, 'Day');
  }
});

router.get('/meals-by-day/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Day.scope('dayMeal').findByPk(id);

    return res.status(200).json({
      status: 'success',
      data: transformTagMeals(result.Meals),
    });
  } catch (error) {
    getErrorType(error, 'Day');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Meal.scope('mealInfo').findByPk(id);

    if (result === null) {
      return res.status(404).send('Meal with the specified ID does not exist');
    }

    const mealData = transformMealInfo(result, id);

    return res.status(200).json({
      status: 'success',
      data: mealData,
    });
  } catch (error) {
    getErrorType(error, 'Meal');
  }
});

router.post('/', async (req, res) => {
  const { dayIds, ingredients } = req.body;
  //FIXME: If items are missing, it throws an error it is not iterable
  //Which is not very informative.
  try {
    //TODO: There should be a nicer way to implement these validations
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
    getErrorType(error, 'Meal');
  }
});

router.put('/:id', async (req, res) => {
  const { id: meal_id } = req.params;

  try {
    await updateMeal(req.body, meal_id);

    return res.status(200).json({
      status: 'success',
    });
  } catch (error) {
    getErrorType(error, 'Meal');
  }
});

//DELETE /:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await deleteMeal(id);

    return res.status(204).json({
      status: 'success',
    });
  } catch (error) {
    getErrorType(error, 'Meal');
  }
});

//TODO: DELETE / All meals

//DELETE a DAY from the meal
router.delete('/:mealId/:dayId', async (req, res) => {
  const { mealId, dayId } = req.params;
  try {
    const days = await MealDay.findAll({
      where: { meal_id: mealId },
    });

    //If the dayId doesn't exist in the table -> do nothing
    if (!days.some((entry) => entry.day_id == dayId)) {
      return res.status(204).json({
        status: 'success',
      });
    }

    //If there are multiple days, only delete the specific day
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
    getErrorType(error, 'Meal');
  }
});
