import request from 'supertest';
import app from '../express/app';

describe('Get Ingredient routes', () => {
  it('should successfully post ingredient data', async () => {
    const res = await await request(app)
      .post('/ingredients')
      .send({ name: 'testIng' });

    expect(res.statusCode).toEqual(201);
    expect(res.body.data).toHaveProperty('name');
    expect(res.body.data).toHaveProperty('id');
  });

  it('should show all Ingredients', async () => {
    const res = await request(app).get('/ingredients');
    expect(res.statusCode).toEqual(200);
    res.body.data.forEach((day) => {
      expect(day).toHaveProperty('id');
      expect(day).toHaveProperty('name');
    });
  });

  it('should return ingredient details', async () => {
    const res = await request(app).get('/ingredients/1');
    expect(res.statusCode).toEqual(200);
    //FIXME: data not be empty?
    expect(res.body.data).toHaveProperty('name');
    expect(res.body.data).toHaveProperty('id');
  });

  it('should throw 404 error if unknown ingredient id', async () => {
    const res = await request(app).get('/ingredients/120');
    expect(res.statusCode).toEqual(404);
    expect(res.text).toEqual('Ingredient with the specified ID does not exist');
  });

  it('should delete a ingredient', async () => {
    const res = await request(app).del('/ingredient/1');
    expect(res.statusCode).toEqual(204);
  });
});
