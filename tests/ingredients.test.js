import request from 'supertest';
import app from '../express/app';
import { createName } from '../express/domain/domainHelper';
import { resetDb } from './testSetup';

beforeEach(() => {
  resetDb();
});

//FIXME: Make these tests uniform and test data in the db

describe('Post/Update Ingredient Routes', () => {
  it('should successfully post ingredient data', async () => {
    const res = await request(app)
      .post('/ingredients')
      .send({ name: 'testIng' });

    expect(res.statusCode).toEqual(201);
    //TODO: Test ingredient is in database
  });

  it('should update ingredient name', async () => {
    await createName('Ingredient', 'testIng');

    const res = await request(app)
      .put('/ingredients/1')
      .send({ name: 'something' });

    expect(res.statusCode).toEqual(200);
    //TODO: Test ingredient is in database
  });

  it(`should throw a 404 error when attempting to update an ingredient 
  which does not exist`, async () => {
    const res = await request(app)
      .put('/ingredients/20')
      .send({ name: 'something' });
    expect(res.statusCode).toEqual(404);
  });
});

describe('Get Ingredient Routes', () => {
  it('should show all Ingredients', async () => {
    await createName('Ingredient', 'testIng');
    await createName('Ingredient', 'testIng2');

    const res = await request(app).get('/ingredients');

    expect(res.statusCode).toEqual(200);
    res.body.data.forEach((ingredient) => {
      expect(ingredient).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
      });
    });
  });

  it('should return ingredient details', async () => {
    await createName('Ingredient', 'testIng');

    const res = await request(app).get('/ingredients/1');

    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toMatchObject({
      id: expect.any(Number),
      name: expect.any(String),
    });
  });

  it('should throw 404 error if unknown ingredient id', async () => {
    const res = await request(app).get('/ingredients/120');
    expect(res.statusCode).toEqual(404);
    expect(res.text).toEqual('Ingredient with the specified ID does not exist');
  });
});

describe('Delete Ingredient Routes', () => {
  it('should delete an ingredient by id', async () => {
    await createName('Ingredient', 'testIng');

    const res = await request(app).del('/ingredients/1');
    expect(res.statusCode).toEqual(204);
  });
});
