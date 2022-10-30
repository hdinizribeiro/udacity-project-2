import express, { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';
import { validate } from '../middlewares/validation/validationMiddleware';
import { AppError, Reasons } from '../middlewares/error/appError';
import { UserStore } from '../models/user';
import { routeNumericIdSchema } from '../utilities/validatorSchemas';

const createUserSchema = yup.object().shape({
  body: yup.object({
    firstname: yup.string().required().max(200),
    lastname: yup.string().required().max(200),
    password: yup.string().required().max(200),
    email: yup.string().required().email()
  })
});

const store = new UserStore();

const userRoutes = (app: express.Application) => {
  app.get('/users', index);
  app.post('/users', validate(createUserSchema), create);
  app.get('/users/:id', validate(routeNumericIdSchema), show);
};

const index = async (_req: Request, res: Response) => {
  const users = await store.index();
  res.json(users);
};

const create = async (req: Request, res: Response) => {
  const user = await store.create({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password
  });

  res.status(201);
  res.json(user);
};

const show = async (req: Request, res: Response, next: NextFunction) => {
  const user = await store.show(parseInt(req.params.id));

  if (!user) {
    next(new AppError('User does not exist', 404, Reasons.ResourceNotFound));
    return;
  }

  res.json(user);
};

export default userRoutes;
