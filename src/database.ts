import { Pool, QueryResult, QueryResultRow } from 'pg';
import dotenv from 'dotenv';

if (process.env.NODE_ENV) {
  dotenv.config({ override: true, path: `.env.${process.env.NODE_ENV}` });
} else {
  dotenv.config();
}

const { POSTGRES_HOST, POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD } =
  process.env;

console.log(`Db:${POSTGRES_DB}`);

const dbClient = new Pool({
  host: POSTGRES_HOST,
  database: POSTGRES_DB,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD
});

const Client = {
  execute: async <T extends QueryResultRow>(
    sql: string,
    params?: unknown[]
  ): Promise<QueryResult<T>> => {
    const connection = await dbClient.connect();
    try {
      return await connection.query<T>(sql, params);
    } finally {
      await connection.release();
    }
  }
};

export default Client;
