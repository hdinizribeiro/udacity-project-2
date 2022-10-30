import express, { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';
import { validate } from '../middlewares/validation/validationMiddleware';
import { AppError, Reasons } from '../middlewares/error/appError';
import { UserStore } from '../models/user';
import { routeNumericIdSchema } from '../utilities/validatorSchemas';
import jwt from 'jsonwebtoken';
import { jwtValidationMiddleware } from '../middlewares/validation/jwtValidationMiddleware';

const createUserSchema = yup.object().shape({
  body: yup.object({
    firstname: yup.string().required().max(200),
    lastname: yup.string().required().max(200),
    password: yup.string().required().max(200),
    email: yup.string().required().email()
  })
});

const authenticateScheme = yup.object().shape({
  body: yup.object({
    password: yup.string().required(),
    email: yup.string().required().email()
  })
});

const store = new UserStore();

const userRoutes = (app: express.Application) => {
  app.get('/users', jwtValidationMiddleware, index);
  app.post(
    '/users',
    jwtValidationMiddleware,
    validate(createUserSchema),
    create
  );
  app.get(
    '/users/:id',
    jwtValidationMiddleware,
    validate(routeNumericIdSchema),
    show
  );
  app.post('/users/authenticate', validate(authenticateScheme), authenticate);
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

const tokenSecret = process.env.TOKEN_SECRET ?? '';
const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await store.authenticate(req.body.email, req.body.password);
    res.status(200).json({
      token: jwt.sign(
        {
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email
        },
        tokenSecret
      )
    });
  } catch (err) {
    next(err);
  }
};

export default userRoutes;
