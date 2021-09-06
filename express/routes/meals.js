import Router from 'express-promise-router';
import { Meal, Day, Tag } from '../../sequelize/index.js';
import AppError, { getErrorType } from '../../utils/appError.js';
import { transformDayMeals, transformTagMeals } from '../domain/domainDay.js';
import {
  createMeal,
  deleteMeal,
  transformMealInfo,
  updateMeal,
} from '../domain/domainMeal.js';

const router = new Router();
export default router;

//GET meal-ingredients

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

//GET meals-by-day/:id
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

//DELETE / (all)

//DELETE /:id/:dayId (delete day from meal)
