import express, { NextFunction, Request, Response } from 'express';
import { ProductStore } from '../models/product';
import * as yup from 'yup';
import { validate } from '../middlewares/validation/validationMiddleware';
import { AppError, Reasons } from '../middlewares/error/appError';
import { routeNumericIdSchema } from '../utilities/validatorSchemas';
import { jwtValidationMiddleware } from '../middlewares/validation/jwtValidationMiddleware';

const store = new ProductStore();

const createProductSchema = yup.object().shape({
  body: yup.object({
    name: yup.string().required().max(200),
    price: yup.number().required()
  })
});

const productRoutes = (app: express.Application) => {
  app.get('/products', index);
  app.post(
    '/products',
    jwtValidationMiddleware,
    validate(createProductSchema),
    create
  );
  app.get('/products/:id', validate(routeNumericIdSchema), show);
};

const index = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await store.index();
    res.json(products);
  } catch (err) {
    next(err);
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await store.create({
      name: req.body.name,
      price: req.body.price
    });
    res.status(201);
    res.json(product);
  } catch (err) {
    next(err);
  }
};

const show = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await store.show(parseInt(req.params.id));

    if (!product) {
      throw new AppError(
        'Product does not exist',
        404,
        Reasons.ResourceNotFound
      );
    }

    res.json(product);
  } catch (err) {
    next(err);
  }
};

export default productRoutes;
