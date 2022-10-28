import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const { POSTGRES_HOST, POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD } =
  process.env;

const dbClient = new Pool({
  host: POSTGRES_HOST,
  database: POSTGRES_DB,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD
});

const Client = {
  execute: async (sql: string, params?: unknown[]) => {
    const connection = await dbClient.connect();
    try {
      return await connection.query(sql, params);
    } finally {
      await connection.release();
    }
  }
};

export default Client;
