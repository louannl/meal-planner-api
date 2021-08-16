import Router from 'express-promise-router';
import sequelize, {
  Ingredient,
  Meal,
  MealDay,
  MealIngredient,
  MealTag,
  Tag,
} from '../../sequelize/index.js';
import AppError, { getErrorType } from '../../utils/appError.js';

const router = new Router();
export default router;

//GET meal-ingredients

//GET meal-with-days

//GET meals-by-day/:id

//GET /:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Meal.scope('mealInfo').findByPk(id);
    if (result == null) {
      return res.status(404).send('Meal with the specified ID does not exist');
    }

    let mealDays = [];
    for (const day of result.Days) {
      mealDays.push(day.id);
    }

    let mealIngredients = [];
    for (const ing of result.Ingredients) {
      mealIngredients.push({
        id,
        ingredient: ing.name,
        amount: ing['UnitTypes'][0]['MealIngredient'].amount,
        unit: ing['UnitTypes'][0].name,
      });
    }

    let mealTags = [];
    result.Tags.forEach((tag) => mealTags.push(tag.name));

    let mealData = {
      id: result.id,
      meal: result.name,
      days: mealDays,
      tags: mealTags,
      ingredients: mealIngredients,
    };

    return res.status(200).json({
      status: 'success',
      data: mealData,
    });
  } catch (error) {
    getErrorType(error, 'Meal');
  }
});

router.post('/', async (req, res) => {
  const { dayIds, mealName, mealTags, ingredients } = req.body;
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

    await sequelize.transaction(async (transaction) => {
      const {
        dataValues: { id: meal_id },
      } = await Meal.create(
        {
          name: mealName,
        },
        { transaction }
      );

      for (const dayId of dayIds) {
        await MealDay.create(
          {
            meal_id,
            day_id: dayId,
          },
          { transaction }
        );
      }

      for (const ingredient of ingredients) {
        const ingredientResult = await Ingredient.findOrCreate({
          where: { name: ingredient.name },
          transaction,
        });
        const ingredient_id = ingredientResult[0].dataValues.id;
        await MealIngredient.create(
          {
            ingredient_id,
            meal_id,
            amount: ingredient.amount,
            unit_type_id: ingredient.unitType,
          },
          { transaction }
        );
      }

      if (mealTags.length > 0) {
        for (const tag of mealTags) {
          const tagResult = await Tag.findOrCreate({
            where: { name: tag },
            transaction,
          });
          const tag_id = tagResult[0].dataValues.id;
          await MealTag.create(
            {
              meal_id,
              tag_id,
            },
            { transaction }
          );
        }
      }
    });

    return res.status(201).json({
      status: 'success',
    });
  } catch (error) {
    getErrorType(error, 'Meal');
  }
});

//PUT /:id
router.put('/:id', async (req, res) => {
  const { id: meal_id } = req.params;
  const { dayIds, mealName, mealTags, ingredients } = req.body;

  try {
    await sequelize.transaction(async (transaction) => {
      //UPDATE MEAL NAME
      await Meal.update(
        {
          name: mealName,
        },
        {
          where: { id: meal_id },
        },
        { transaction }
      );
      //UPDATE MEAL DAYS 1. DESTROY THEN CREATE
      await MealDay.destroy(
        {
          where: {
            meal_id,
          },
        },
        { transaction }
      );

      let mappedDays = [];
      await dayIds.forEach((dayId) => {
        mappedDays.push({
          meal_id,
          day_id: dayId,
        });
      });

      await MealDay.bulkCreate(mappedDays, { transaction });

      //UPDATE INGREDIENTS - DELETE THEN CREATE
      await MealIngredient.destroy(
        {
          where: {
            meal_id,
          },
        },
        { transaction }
      );

      for (const ingredient of ingredients) {
        const ingredientResult = await Ingredient.findOrCreate({
          where: { name: ingredient.name },
          transaction,
        });
        const ingredient_id = ingredientResult[0].dataValues.id;
        await MealIngredient.create(
          {
            ingredient_id,
            meal_id,
            amount: ingredient.amount,
            unit_type_id: ingredient.unitType,
          },
          { transaction }
        );
      }

      //UPDATE TAGS - DELETE THEN CREATE
      await MealTag.destroy(
        {
          where: {
            meal_id,
          },
        },
        { transaction }
      );

      if (mealTags.length > 0) {
        for (const tag of mealTags) {
          const tagResult = await Tag.findOrCreate({
            where: { name: tag },
            transaction,
          });
          const tag_id = tagResult[0].dataValues.id;
          await MealTag.create(
            {
              meal_id,
              tag_id,
            },
            { transaction }
          );
        }
      }
    });

    return res.status(200).json({
      status: 'success',
    });
  } catch (error) {
    getErrorType(error, 'Meal');
  }
});

//DELETE /:id

//DELETE / (all)

//DELETE /:id/:dayId (delete day from meal)
