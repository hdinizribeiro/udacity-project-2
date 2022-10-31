import supertest from 'supertest';
import app from '../../server';
import jwt from 'jsonwebtoken';

const request = supertest.agent(app);

beforeAll(async () => {
  const token = await jwt.sign(
    { firstname: 'user', lastname: 'test', email: 'user@email.comm' },
    process.env.TOKEN_SECRET ?? ''
  );

  request.set('Authorization', `bearer ${token}`);
});

describe('Order endpoint tests', () => {
  it('Should return 200 and a list orders on GET users/:id/orders/active endpoint', async () => {
    // Arrange & Act
    const response = await request.get('/users/1/orders/active');

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });
});
