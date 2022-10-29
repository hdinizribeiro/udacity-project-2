import express, { Request, Response } from 'express';
import { ProductStore } from '../models/product';
import * as yup from 'yup';
import { validate } from '../middlewares/validation/validationMiddleware';

const store = new ProductStore();

const createProductSchema = yup.object().shape({
  body: yup.object({
    name: yup.string().required().max(200),
    price: yup.number().required()
  })
});

const showProductSchema = yup.object().shape({
  params: yup.object({
    id: yup.number().integer().moreThan(0)
  })
});

const productRoutes = (app: express.Application) => {
  app.get('/products', index);
  app.post('/products', validate(createProductSchema), create);
  app.get('/products/:id', validate(showProductSchema), show);
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
  res.status(201);
  res.json(product);
};

const show = async (req: Request, res: Response) => {
  const product = await store.show(parseInt(req.params.id));
  res.json(product);
};

export default productRoutes;
