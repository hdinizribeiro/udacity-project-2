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

  it('Should return valid jwt token on POST /users/authenticate if the password is correct', async () => {
    // Arrange
    const newUser = (
      await request.post('/users').send({
        firstname: 'new',
        lastname: 'user',
        email: 'any@email.com',
        password: 'pass'
      })
    ).body;

    // Act
    const response = await request
      .post('/users/authenticate')
      .send({ email: newUser.email, password: 'pass' });

    // Assert
    expect(response.statusCode).toBe(200);
    const decodedToken = (await jwt.verify(
      response.body.token,
      process.env.TOKEN_SECRET ?? ''
    )) as jwt.JwtPayload;

    expect(decodedToken).toEqual({
      firstname: newUser.firstname,
      lastname: newUser.lastname,
      email: newUser.email,
      iat: decodedToken.iat
    });
  });

  it('Should return 401 on POST /users/authenticate if the password is wrong', async () => {
    // Arrange
    await request.post('/users').send({
      firstname: 'new',
      lastname: 'user',
      email: 'any@email.com',
      password: 'pass'
    });

    // Act
    const response = await request
      .post('/users/authenticate')
      .send({ email: 'any@email.com', password: 'pass1' });

    // Assert
    expect(response.statusCode).toBe(401);
  });
});
