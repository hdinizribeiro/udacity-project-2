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

describe('Products endpoint tests', () => {
  it('Should return 200 and a list of products on GET /products endpoint', async () => {
    // Arrange
    const newProduct = (
      await request.post('/products').send({ name: 'new product', price: 15 })
    ).body;

    // Act
    const response = await request.get('/products');

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([newProduct]);
  });

  it('Should return 200 and one product on GET /products/:id', async () => {
    // Arrange
    const newProduct = (
      await request.post('/products').send({ name: 'new product', price: 15 })
    ).body;

    // Act
    const response = await request.get(`/products/${newProduct.id}`);

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(newProduct);
  });

  it('Should return 404 and one product on GET /products/:id whan the product does not exist', async () => {
    // Arrange & Act
    const response = await request.get(`/products/1`);

    // Assert
    expect(response.statusCode).toBe(404);
  });

  it('Should return 201 on POST /products', async () => {
    // Arrange & Act
    const response = await request
      .post('/products')
      .send({ name: 'new-product', price: 10 });

    // Assert
    expect(response.statusCode).toBe(201);
  });

  it('Should return 400 when GET /products/:id receives invalid id', async () => {
    // Arrange & Act
    const response = await request.get(`/products/0`);

    // Assert
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      message: 'Validation errors',
      reason: 'Invalidrequest',
      data: [{ errors: ['params.id must be greater than 0'] }],
      statusCode: 400
    });
  });

  it('Should return 400 POST /products receives invalid values', async () => {
    // Arrange & Act
    const response = await request
      .post('/products')
      .send({ name: '', price: 'test' });

    // Assert
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      message: 'Validation errors',
      reason: 'Invalidrequest',
      data: [
        {
          errors: [
            'body.name is a required field',
            'body.price must be a `number` type, but the final value was: `NaN` (cast from the value `"test"`).'
          ]
        }
      ],
      statusCode: 400
    });
  });
});
