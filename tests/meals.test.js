import request from 'supertest';
import app from '../express/app';
import { createMeal, transformMealInfo } from '../express/domain/domainMeal';
import { Meal, MealDay } from '../sequelize';

import resetDb from './testSetup';

beforeEach(() => resetDb());

// HELPERS - Test data:
const validMealData = {
  dayIds: [3, 5],
  mealName: 'Beef Casserole',
  mealTags: ['Dinner'],
  ingredients: [
    {
      name: 'Diced Beef',
      amount: '200',
      unitType: '1',
    },
    {
      name: 'Red Pepper',
      amount: '1',
      unitType: '3',
    },
  ],
};

const validMealData2 = {
  mealName: 'ketchup',
  dayIds: ['3', '4'],
  mealTags: ['Dinner', 'Protein', 'Snacks'],
  ingredients: [
    {
      name: 'tomato',
      amount: '3000',
      unitType: '2',
    },
    {
      name: 'Red Pepper',
      amount: '1',
      unitType: '3',
    },
  ],
};

const mealDataMissingDays = {
  dayIds: [],
  mealName: 'Beef Casserole',
  mealTags: ['Dinner'],
  ingredients: [
    {
      name: 'Diced Beef',
      amount: 200,
      unitType: '1',
    },
    {
      name: 'Red Pepper',
      amount: 1,
      unitType: '3',
    },
  ],
};

describe('Post/Put meal routes', () => {
  it('should create a meal with ingredients, tags and days', async () => {
    const res = await request(app).post('/meals').send(validMealData);
    expect(res.statusCode).toEqual(201);
    // TODO: check db data afterwards
  });

  it('should throw an error when trying to create an existing meal', async () => {
    // TODO:Post twice here
    await request(app).post('/meals').send(validMealData);
    const res = await request(app).post('/meals').send(validMealData);
    expect(res.statusCode).toEqual(409);
    // TODO: Validate no duplicates in DB
  });

  it('should throw an error when creating a meal without any days', async () => {
    const res = await request(app).post('/meals').send(mealDataMissingDays);
    expect(res.statusCode).toEqual(400);
  });

  it('should update meal with name, ingredients, tags and days', async () => {
    await createMeal(validMealData);

    const res = await request(app).put('/meals/1').send(validMealData2);
    expect(res.statusCode).toEqual(200);
    // TODO: Check data is in database
  });
});

describe('Get meal routes', () => {
  it('should get a specified meal and details by the id', async () => {
    await createMeal(validMealData);
    const res = await request(app).get('/meals/1');
    expect(res.statusCode).toEqual(200);

    expect(res.body.data).toMatchObject({
      id: expect.any(Number),
      meal: expect.any(String),
      days: expect.any(Array),
      tags: expect.any(Array),
      ingredients: expect.any(Array),
    });

    res.body.data.ingredients.forEach((ingredient) => {
      expect(ingredient).toMatchObject({
        id: expect.any(Number),
        ingredient: expect.any(String),
        amount: expect.any(Number),
        unit: expect.any(String),
      });
    });
  });

  it('should get all meals sorted by days', async () => {
    await createMeal(validMealData);
    await createMeal(validMealData2);

    const res = await request(app).get('/meals/meals-with-days');
    expect(res.statusCode).toEqual(200);
    res.body.data.forEach((day) => {
      expect(day).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        meals: expect.any(Array),
      });
    });
  });

  it('should get all meals on a specified day', async () => {
    await createMeal(validMealData);

    const res = await request(app).get('/meals/meals-by-day/3');
    expect(res.statusCode).toEqual(200);
    res.body.data.forEach((meal) => {
      expect(meal).toMatchObject({
        id: expect.any(Number),
        meal: expect.any(String),
        tags: expect.any(Array),
      });
    });
  });

  it('should get all meal-ingredients and aggregate them', async () => {
    await createMeal(validMealData);
    await createMeal(validMealData2);

    // FIXME: Checks it actually adds up correctly

    const res = await request(app).get('/meals/meal-ingredients');
    expect(res.statusCode).toEqual(200);
    res.body.data.forEach((ing) => {
      expect(ing).toMatchObject({
        ingredient: expect.any(String),
        total: expect.any(String),
        unit: expect.any(String),
      });
    });
  });
});

describe('Delete meal routes', () => {
  it('should only delete the day from the meal', async () => {
    await createMeal(validMealData);

    // Check if we delete a non-existent day, it doesn't delete the meal
    await request(app).del('/meals/1/7');

    const dbMealData = await Meal.scope('mealInfo').findByPk(1);
    const transformedDbMeal = transformMealInfo(dbMealData);

    expect(transformedDbMeal.days).toEqual(validMealData.dayIds);
    expect(transformedDbMeal.meal).toEqual(validMealData.mealName);
    expect(transformedDbMeal.tags).toEqual(validMealData.mealTags);
    expect(transformedDbMeal.ingredients.map((ing) => ing.ingredient)).toEqual(
      validMealData.ingredients.map((ing) => ing.name),
    );

    const res = await request(app).del('/meals/1/3');
    expect(res.statusCode).toEqual(204);

    // Check if we delete a day the meal still exists with remaining days:
    const days = await MealDay.findAll({
      where: { meal_id: 1 },
      attributes: ['day_id'],
    });
    expect(days.length).toEqual(1);
    expect(days[0].day_id).toEqual(5);

    // TODO: Separate these tests more, so it's cleaner
    // Check if we delete the remaining day, it deletes the entire meal
    const response = await request(app).del('/meals/1/5');
    expect(response.statusCode).toEqual(204);
    const mealData = await request(app).get('/meals/1');
    expect(mealData.statusCode).toEqual(404);
  });

  it('should delete an individual meal by id', async () => {
    // TODO: I'd rather run a beforeAll, tear down and re-implement
    await createMeal(validMealData);

    const res = await request(app).del('/meals/1');
    expect(res.statusCode).toEqual(204);
    await request(app).get('/meals/1').expect(404);
  });

  /*
   it('should delete all meals, including the meal ingredients/tags/days',
   async () => {});
  */
});
