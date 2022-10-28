import Client from '../database';

export type Product = {
  id?: number;
  name: string;
  price: number;
};

export class ProductStore {
  async show(id: number) {
    const sql = 'SELECT Id, Name, Price FROM Products WHERE Id=$1';
    const result = await Client.execute(sql, [id]);
    return result.rows[0];
  }

  async create(product: Product): Promise<Product> {
    const sql = 'INSERT INTO Products (name, price) VALUES($1, $2) RETURNING *';
    const result = await Client.execute(sql, [product.name, product.price]);
    return result.rows[0];
  }

  async index(): Promise<Product[]> {
    const sql = 'SELECT Id, Name, Price FROM Products';
    const result = await Client.execute(sql);
    return result.rows;
  }
}
