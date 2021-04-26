import Router from 'express-promise-router';
import { getOne, getAll } from './handler.js';
import { createMeal } from '../domain/meals.js';
import validate from '../utils/validate.js';
import { checkSchema } from 'express-validator';
import { getErrorType } from '../utils/appError.js';

const router = new Router();
export default router;

//GET MEAL/:id
getOne(router, 'meals');
getAll(router, 'meals');

//GET MEALS BY DAYS
router.get('/');

//('SELECT * from meals_days WHERE day_id = ($1)'), [dayId] )

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
      //TODO: remove console log
      console.log(error);
      getErrorType(error);
    }
  }
);
