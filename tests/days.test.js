import request from 'supertest';
import app from '../express/app';

describe('Day route', () => {
  it('should show all days', async () => {
    const res = await request(app).get('/days');
    expect(res.statusCode).toEqual(200);
  });
});
