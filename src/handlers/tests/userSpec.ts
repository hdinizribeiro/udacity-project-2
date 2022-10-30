import supertest from 'supertest';
import app from '../../server';

const request = supertest(app);

describe('Users endpoint tests', () => {
  it('Should return 200 and a list of users on GET /users endpoint', async () => {
    // Arrange
    const newUser = (
      await request.post('/users').send({
        email: 'any@email.com',
        firstname: 'new',
        lastname: 'user',
        password: 'pass'
      })
    ).body;

    // Act
    const response = await request.get('/users');

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([newUser]);
  });

  it('Should return 200 and one user on GET /users/:id', async () => {
    // Arrange
    const newUser = (
      await request.post('/users').send({
        email: 'any@email.com',
        firstname: 'new',
        lastname: 'user',
        password: 'pass'
      })
    ).body;

    // Act
    const response = await request.get(`/users/${newUser.id}`);

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(newUser);
  });

  it('Should return 404 and one user on GET /users/:id whan the user does not exist', async () => {
    // Arrange & Act
    const response = await request.get(`/users/1`);

    // Assert
    expect(response.statusCode).toBe(404);
  });

  it('Should return 201 on POST /users', async () => {
    // Arrange & Act
    const response = await request.post('/users').send({
      email: 'any@email.com',
      firstname: 'new',
      lastname: 'user',
      password: 'pass'
    });

    // Assert
    expect(response.statusCode).withContext('status code').toBe(201);
  });

  it('Should return 400 when GET /users/:id receives invalid id', async () => {
    // Arrange & Act
    const response = await request.get(`/users/0`);

    // Assert
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      message: 'Validation errors',
      reason: 'Invalidrequest',
      data: [{ errors: ['params.id must be greater than 0'] }],
      statusCode: 400
    });
  });

  it('Should return 400 on POST /users if it receives invalid values', async () => {
    // Arrange & Act
    const response = await request.post('/users').send({
      firstname: '',
      lastname: '',
      email: 'any@email.com',
      password: ''
    });

    // Assert
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      message: 'Validation errors',
      reason: 'Invalidrequest',
      data: [
        {
          errors: [
            'body.firstname is a required field',
            'body.lastname is a required field',
            'body.password is a required field'
          ]
        }
      ],
      statusCode: 400
    });
  });
});
