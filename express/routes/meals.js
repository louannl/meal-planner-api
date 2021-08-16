import Router from 'express-promise-router';
import sequelize from '../../sequelize/index.js';
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

    const result = await sequelize.models['Meal']
      .scope('mealInfo')
      .findByPk(id);

    if (result) {
      return res.status(200).json({
        status: 'success',
        data: result,
      });
    }

    return res.status(404).send('Meal with the specified ID does not exist');
  } catch (error) {
    console.log(error);
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
      } = await sequelize.models['Meal'].create(
        {
          name: mealName,
        },
        { transaction }
      );

      for (const dayId of dayIds) {
        await sequelize.models['MealDay'].create(
          {
            meal_id,
            day_id: dayId,
          },
          { transaction }
        );
      }

      for (const ingredient of ingredients) {
        const ingredientResult = await sequelize.models[
          'Ingredient'
        ].findOrCreate({
          where: { name: ingredient.name },
          transaction,
        });
        const ingredient_id = ingredientResult[0].dataValues.id;
        await sequelize.models['MealIngredient'].create(
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
          const tagResult = await sequelize.models['Tag'].findOrCreate({
            where: { name: tag },
            transaction,
          });
          const tag_id = tagResult[0].dataValues.id;
          await sequelize.models['MealTag'].create(
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
    console.log(error);
    getErrorType(error, 'Meal');
  }
});

//PUT /:id

//DELETE /:id

//DELETE / (all)

//DELETE /:id/:dayId (delete day from meal)
