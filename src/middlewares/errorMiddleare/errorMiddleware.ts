import express, { ErrorRequestHandler } from 'express';
import { ApiError } from './apiError';

const defaultErrorMiddleware: ErrorRequestHandler = (
  err: express.ErrorRequestHandler,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json(err.toJson());
  } else {
    res.sendStatus(500);
  }

  next(err);
};

export { defaultErrorMiddleware };
