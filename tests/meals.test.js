import request from 'supertest';
import app from '../express/app';

describe('Post/Put meal routes', () => {
  it('should create a meal with ingredients, tags and days', async () => {
    const res = await request(app)
      .post('/meals')
      .send({
        dayIds: ['3', '5'],
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
      });
    expect(res.statusCode).toEqual(201);
  });

  it('should throw an error when trying to create an existing meal', async () => {
    const res = await request(app)
      .post('/meals')
      .send({
        dayIds: ['3', '5'],
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
      });
    expect(res.statusCode).toEqual(409);
  });

  it('should throw an error when creating a meal without any days', async () => {
    const res = await request(app)
      .post('/meals')
      .send({
        dayIds: [],
        mealName: 'I have no days',
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
      });
    expect(res.statusCode).toEqual(400);
  });

  it('should update meal with name, ingredients, tags and days', async () => {
    const res = await request(app)
      .put('/meals/1')
      .send({
        mealName: 'ketchup',
        dayIds: ['3', '4'],
        mealTags: ['Dinner', 'Protein', 'Snacks'],
        ingredients: [
          {
            name: 'tomato',
            amount: '3000',
            unitType: '2',
          },
        ],
      });
    expect(res.statusCode).toEqual(200);
  });
});

describe('Get meal routes', () => {
  it('should get a specified meal and details by the id', async () => {
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
        id: expect.any(String),
        ingredient: expect.any(String),
        amount: expect.any(Number),
        unit: expect.any(String),
      });
    });
  });

  it('should get all meals sorted by days', async () => {
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

  // it('should get all meal ingredients and aggregate them', async () => {
  //   const res = await request(app).get('meals/meal-ingredients');
  //   expect(res.statusCode).toEqual(200);
  //   res.body.data.forEach((ingredient) => {
  //     expect(ingredient).toMatchObject({
  //       id: expect.any(Number),
  //       ingredient: expect.any(String),
  //       amount: expect.any(Number),
  //       unitType: expect.any(String),
  //     });
  //   });
  // });
});

describe('Delete meal routes', () => {
  it('should delete an individual meal by id', async () => {
    const res = await request(app).del('/meals/1');
    expect(res.statusCode).toEqual(204);
    await request(app).get('/meals/1').expect(404);
  });
  it('should delete all meals, including the meal ingredients/tags/days', async () => {});
  it('should only delete the day from the meal', async () => {});
});
