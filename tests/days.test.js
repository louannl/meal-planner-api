import request from 'supertest';
import app from '../express/app';

describe('Get Day route', () => {
  it('should show all days', async () => {
    const res = await request(app).get('/days');
    expect(res.statusCode).toEqual(200);
    res.body.forEach((day) => {
      expect(day).toHaveProperty('name');
      expect(day).toHaveProperty('id');
    });
  });

  it('should show first day', async () => {
    const res = await request(app).get('/days/1');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('day');
    expect(res.body.day).toHaveProperty('name');
    expect(res.body.day).toHaveProperty('id');
  });

  it('should throw 404 error if unknown day id', async () => {
    const res = await request(app).get('/days/120');
    expect(res.statusCode).toEqual(404);
    expect(res.text).toEqual('Day with the specified ID does not exist');
  });
});
