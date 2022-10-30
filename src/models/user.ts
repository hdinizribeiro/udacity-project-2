import Client from '../database';
import bcrypt from 'bcrypt';
import { AppError, Reasons } from '../middlewares/error/appError';

export type User = {
  id?: number;
  firstname: string;
  lastname: string;
  password: string;
  email: string;
};

const peper = process.env.BCRYPT_PEPER;
const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS as string);

export class UserStore {
  async show(id: number): Promise<User | null> {
    const sql = 'SELECT Id, FirstName, LastName, Email FROM Users WHERE Id=$1';
    const result = await Client.execute<User>(sql, [id]);

    if (result.rows.length == 0) {
      return null;
    }

    return result.rows[0];
  }

  async create(user: User): Promise<User> {
    if (await this.emailExists(user.email)) {
      throw new AppError(
        'Email already exists',
        409,
        Reasons.ResourceAlreadyExists
      );
    }

    const sql =
      'INSERT INTO Users (FirstName, LastName, Password, Email) VALUES($1, $2, $3, $4) RETURNING Id, FirstName, LastName, Email';

    const passwordHash = await bcrypt.hash(user.password + peper, saltRounds);

    const result = await Client.execute<User>(sql, [
      user.firstname,
      user.lastname,
      passwordHash,
      user.email
    ]);

    return { ...result.rows[0] };
  }

  async index(): Promise<User[]> {
    const sql = 'SELECT Id, FirstName, LastName, Email FROM Users';
    const result = await Client.execute<User>(sql);
    return result.rows;
  }

  async authenticate(email: string, password: string): Promise<User> {
    const sql =
      'SELECT Id, FirstName, LastName, Email, Password FROM Users WHERE Email=$1';
    const result = await Client.execute<User>(sql, [email]);

    if (result.rows.length === 0) {
      throw new AppError('Invalid user', 401, Reasons.Unauthorized);
    }

    const user = result.rows[0];
    const authenticated = await bcrypt.compare(password + peper, user.password);

    if (!authenticated) {
      throw new AppError('Invalid user', 401, Reasons.Unauthorized);
    }
    user.password = '';
    return user;
  }

  private async emailExists(email: string): Promise<boolean> {
    const sql = 'SELECT 1 FROM Users WHERE Email=$1 LIMIT 1';

    const result = await Client.execute<User>(sql, [email]);

    return result.rows.length > 0;
  }
}
