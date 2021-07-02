import request from 'supertest';
import app from '../express/app';

describe('Day route', () => {
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
});
