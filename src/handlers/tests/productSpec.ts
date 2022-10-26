import supertest from 'supertest';
import app from '../../server';

const request = supertest(app);

describe('Products endpoint tests', () => {
  it('Should return 200 and a list of products on /products endpoint', async () => {
    // Arrange

    // Act
    const response = await request.get('/products');

    // Assert
    expect(response.statusCode).toBe(200);
  });
});

//[] Should return 200 and a list of products on /products endpoint
