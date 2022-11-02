import supertest from 'supertest';
import app from '../../server';
import jwt from 'jsonwebtoken';
import Client from '../../database';
import { Order, OrderStatus } from '../../models/order';

const request = supertest.agent(app);

beforeAll(async () => {
  const token = await jwt.sign(
    { firstname: 'user', lastname: 'test', email: 'user@email.comm' },
    process.env.TOKEN_SECRET ?? ''
  );

  request.set('Authorization', `bearer ${token}`);
});

describe('Order endpoint tests', () => {
  it('Should return 200 and a list of active orders on GET users/:id/orders/active endpoint', async () => {
    // Arrange
    const product = (
      await request.post('/products').send({ name: 'Product', price: 32 })
    ).body;

    const user = (
      await request.post('/users').send({
        email: 'any@email.com',
        firstname: 'new',
        lastname: 'user',
        password: 'pass'
      })
    ).body;

    const activeOrder = (
      await Client.execute<Order>(
        'INSERT INTO Orders (Quantity, UserId, Status) VALUES ($1,$2,$3) RETURNING *',
        [20, user.id, OrderStatus.Active]
      )
    ).rows[0];

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const completedOrder = (
      await Client.execute<Order>(
        'INSERT INTO Orders (Quantity, UserId, Status) VALUES ($1,$2,$3) RETURNING *',
        [2, user.id, OrderStatus.Complete]
      )
    ).rows[0];

    await Client.execute(
      'INSERT INTO OrderProducts (OrderId, ProductId) VALUES ($1,$2)',
      [activeOrder.id, product.id]
    );

    await Client.execute(
      'INSERT INTO OrderProducts (OrderId, ProductId) VALUES ($1,$2)',
      [completedOrder.id, product.id]
    );

    // Act
    const response = await request.get(`/users/${user.id}/orders/active`);

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([
      {
        id: activeOrder.id,
        userid: user.id ?? 0,
        quantity: activeOrder.quantity,
        status: activeOrder.status,
        productids: [product.id ?? 0]
      }
    ]);
  });

  describe('Unauthorize tests', () => {
    it('Should return 401 the auth token was not provided', async () => {
      // Arrange & Act
      const responseCreate = await request
        .get('/users/1/orders/active')
        .set('Authorization', '');

      // Assert
      expect(responseCreate.status).toBe(401);
    });
  });
});
