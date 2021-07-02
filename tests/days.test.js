import request from 'supertest';
import app from '../express/app';

describe('Get Day route', () => {
  it('should show all days', async () => {
    const res = await request(app).get('/days');
    expect(res.statusCode).toEqual(200);
    res.body.data.forEach((day) => {
      expect(day).toHaveProperty('id');
      expect(day).toHaveProperty('name');
    });
  });

  it('should show first day', async () => {
    const res = await request(app).get('/days/1');
    expect(res.statusCode).toEqual(200);
    //FIXME: data not be empty?
    expect(res.body.data).toHaveProperty('name');
    expect(res.body.data).toHaveProperty('id');
  });

  it('should throw 404 error if unknown day id', async () => {
    const res = await request(app).get('/days/120');
    expect(res.statusCode).toEqual(404);
    expect(res.text).toEqual('Day with the specified ID does not exist');
  });
});
