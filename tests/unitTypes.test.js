import request from 'supertest';
import app from '../express/app';

describe('Get unitType route', () => {
  it('should show all unitTypes, there will always be data', async () => {
    const res = await request(app).get('/unit-types');
    expect(res.statusCode).toEqual(200);
    res.body.data.forEach((unit) => {
      expect(unit).toHaveProperty('id');
      expect(unit).toHaveProperty('name');
      expect(unit).toHaveProperty('symbol');
    });
  });

  it('should show first unitType, which will always exist', async () => {
    const res = await request(app).get('/unit-types/1');
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toHaveProperty('name');
    expect(res.body.data).toHaveProperty('id');
  });

  it('should throw 404 error if unknown unitType id', async () => {
    const res = await request(app).get('/unit-types/120');
    expect(res.statusCode).toEqual(404);
    expect(res.text).toEqual('UnitType with the specified ID does not exist');
  });

  it('should throw error if unauthorised post request is made', async () => {
    const res = await request(app).post('/unit-types/1').send({
      name: 'something',
      symbol: 'sm',
    });
    //FIXME: Is this a good enough response?
    expect(res.statusCode).toEqual(404);
  });
});
