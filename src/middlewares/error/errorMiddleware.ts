import express, { ErrorRequestHandler } from 'express';
import { AppError } from './appError';

const defaultErrorMiddleware: ErrorRequestHandler = (
  err: express.ErrorRequestHandler,
  _req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json(err.toJson());
  } else {
    res.sendStatus(500);
  }

  next(err);
};

export { defaultErrorMiddleware };
