import Client from '../../database';
import { User, UserStore } from '../user';
import bcrypt from 'bcrypt';

const sutUserStore = new UserStore();

describe('Use Store Tests', () => {
  it('Should return all users', async () => {
    // Arrange
    const newUser = await sutUserStore.create({
      firstname: 'new',
      lastname: 'user',
      password: 'pass',
      email: 'any@email'
    });

    // Act
    const result = await sutUserStore.index();

    // Assert
    expect(result.length).toBe(1);
    expect(result).toContain(newUser);
  });

  it('Should create a user', async () => {
    // Arrange
    const user: User = {
      firstname: 'new',
      lastname: 'user',
      password: 'pass',
      email: 'any@email'
    };

    // Act
    const insertedUser = await sutUserStore.create(user);

    // Assert
    user.id = insertedUser.id;
    insertedUser.password = '';
    user.password = '';
    expect(insertedUser).toEqual(user);
  });

  it('Should show a user', async () => {
    // Arrange
    const newUser = await sutUserStore.create({
      firstname: 'new',
      lastname: 'user',
      password: 'pass',
      email: 'any@email'
    });

    // Act
    const result = await sutUserStore.show(newUser.id ?? 0);

    // Assert
    expect(result).toEqual(newUser);
  });

  it('Should encrypt user password', async () => {
    // Arrange
    const password = 'pass';
    const newUser = await sutUserStore.create({
      firstname: 'new',
      lastname: 'user',
      password: password,
      email: 'any@email'
    });

    // Act
    const result = await Client.execute(
      'SELECT Password FROM Users WHERE Id=$1',
      [newUser.id ?? 0]
    );
    const insertedPassword = result.rows[0].password;

    // Assert
    const peper = process.env.BCRYPT_PEPER;
    const comparisonResult = await bcrypt.compare(
      password + peper,
      insertedPassword
    );

    expect(comparisonResult).toBe(true);
  });
});
