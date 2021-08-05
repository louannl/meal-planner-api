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
  // it('should update a meal with ingredients, tags and days', async () => {});
});

// describe('Get meal routes', () => {
//   it('should get all meal details by the meal id', async () => {
//     const res = await request(app).get('/meals/1');
//     expect(res.statusCode).toEqual(200);
//     expect(res.body.data).toHaveProperty('id');
//     expect(res.body.data).toHaveProperty('name');
//     expect(res.body.data).toHaveProperty('days');
//     expect(res.body.data).toHaveProperty('tags');
//     //TODO: for each ing to have name, amount, unitTypeid
//     expect(res.body.data).toHaveProperty('ingredients');
//   });

//   it('should get all meals under days', async () => {
//     const res = await request(app).get('/meals/meals-with-day');
//     expect(res.statusCode).toEqual(200);
//     res.body.data.forEach((meal) => {
//       expect(meal).toHaveProperty('id');
//       expect(meal).toHaveProperty('name');
//     });
//   });

//   it('should get meals by day id', async () => {
//     const res = await request(app).get('/meals/meals-by-day/1');
//     expect(res.statusCode).toEqual(200);
//     res.body.data.forEach((meal) => {
//       expect(meal).toHaveProperty('id');
//       expect(meal).toHaveProperty('name');
//     });
//   });

//   it('should get all meal ingredients and aggregate them', async () => {
//     const res = await request(app).get('meals/meal-ingredients');
//     expect(res.statusCode).toEqual(200);
//     res.body.data.forEach((ingredient) => {
//       expect(ingredient).toHaveProperty('id');
//       expect(ingredient).toHaveProperty('name');
//       expect(ingredient).toHaveProperty('amount');
//       expect(ingredient).toHaveProperty('unitType');
//     });
//   });
// });

// describe('Delete meal routes', () => {
//   it('should delete an individual meal by id', async () => {});
//   it('should delete all meals, including the meal ingredients/tags/days', async () => {});
//   it('should only delete the day from the meal', async () => {});
// });
