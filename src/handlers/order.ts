import express, { NextFunction, Request, Response } from 'express';
import { validate } from '../middlewares/validation/validationMiddleware';
import { routeNumericIdSchema } from '../utilities/validatorSchemas';
import { jwtValidationMiddleware } from '../middlewares/validation/jwtValidationMiddleware';
import { OrderStatus, OrderStore } from '../models/order';

const store = new OrderStore();

const orderRoutes = (app: express.Application) => {
  app.get(
    '/users/:id/orders/active',
    jwtValidationMiddleware,
    validate(routeNumericIdSchema),
    userActiveOrders
  );
};

const userActiveOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orders = await store.userOrders(
      parseInt(req.params.id),
      OrderStatus.Active
    );
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

export default orderRoutes;
