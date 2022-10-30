import Client from '../database';

export type Product = {
  id?: number;
  name: string;
  price: string; //limitation of node-postgres https://github.com/brianc/node-postgres/issues/811
};

export class ProductStore {
  async show(id: number): Promise<Product | null> {
    const sql = 'SELECT Id, Name, Price FROM Products WHERE Id=$1';
    const result = await Client.execute<Product>(sql, [id]);

    if (result.rows.length == 0) {
      return null;
    }

    return result.rows[0];
  }

  async create(product: Product): Promise<Product> {
    const sql = 'INSERT INTO Products (name, price) VALUES($1, $2) RETURNING *';
    const result = await Client.execute<Product>(sql, [
      product.name,
      product.price
    ]);
    return result.rows[0];
  }

  async index(): Promise<Product[]> {
    const sql = 'SELECT Id, Name, Price FROM Products';
    const result = await Client.execute<Product>(sql);
    return result.rows;
  }
}
