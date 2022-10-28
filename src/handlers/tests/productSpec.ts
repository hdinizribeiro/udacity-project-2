import exp from 'constants';
import supertest from 'supertest';
import { ApiError, Reasons } from '../../middlewares/errorMiddleare/apiError';
import app from '../../server';

const request = supertest(app);

describe('Products endpoint tests', () => {
  it('Should return 200 and a list of products on /products endpoint', async () => {
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

  it('Should return 200 and one product on /products/:id', async () => {
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

  fit('Should return 400 when /products/:id receives invalid id', async () => {
    // Arrange & Act
    const response = await request.get(`/products/0`);

    // Assert
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(
      new ApiError(
        'params.id must be greater than 0',
        400,
        Reasons.InvalidRequest
      )
        .addData('validation', ['params.id must be greater than 0'])
        .toJson()
    );
  });
});

//[] Should return 200 and a list of products on /products endpoint
