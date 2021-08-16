import request from 'supertest';
import app from '../express/app';

describe('Get Ingredient routes', () => {
  it('should successfully post ingredient data', async () => {
    const res = await request(app)
      .post('/ingredients')
      .send({ name: 'testIng' });

    expect(res.statusCode).toEqual(201);
  });

  it('should show all Ingredients', async () => {
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
    const res = await request(app).get('/ingredients/1');
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toMatchObject({
      id: expect.any(Number),
      name: expect.any(String),
    });
  });

  it('should update ingredient name', async () => {
    const res = await request(app)
      .put('/ingredients/1')
      .send({ name: 'something' });
    expect(res.statusCode).toEqual(200);
  });

  it('should throw a 404 error when attempting to update an ingredient which does not exist', async () => {
    const res = await request(app)
      .put('/ingredients/20')
      .send({ name: 'something' });
    expect(res.statusCode).toEqual(404);
  });

  it('should throw 404 error if unknown ingredient id', async () => {
    const res = await request(app).get('/ingredients/120');
    expect(res.statusCode).toEqual(404);
    expect(res.text).toEqual('Ingredient with the specified ID does not exist');
  });

  it('should delete an ingredient by id', async () => {
    const res = await request(app).del('/ingredients/1');
    expect(res.statusCode).toEqual(204);
  });
});
