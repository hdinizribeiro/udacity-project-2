import express, { Request, Response } from 'express';
import { ProductStore } from '../models/product';

const store = new ProductStore();

const productRoutes = (app: express.Application) => {
  app.get('/products', index);
  app.post('/products', create);
  app.get('/products/:id', show);
};

const index = async (_req: Request, res: Response) => {
  const products = await store.index();
  res.json(products);
};

const create = async (req: Request, res: Response) => {
  const product = await store.create({
    name: req.body.name,
    price: req.body.price
  });

  res.json(product);
};

const show = async (req: Request, res: Response) => {
  const product = await store.show(parseInt(req.params.id));
  res.json(product);
};

export default productRoutes;
