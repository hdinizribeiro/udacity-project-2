import supertest from 'supertest';
import { Product } from '../../models/product';
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
});

//[] Should return 200 and a list of products on /products endpoint
