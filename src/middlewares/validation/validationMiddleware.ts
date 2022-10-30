import express from 'express';
import * as yup from 'yup';
import { AppError, Reasons } from '../error/appError';

export const validate =
  (schema: yup.BaseSchema) =>
  async (
    req: express.Request,
    _res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      await schema.validate(
        {
          body: req.body,
          query: req.query,
          params: req.params
        },
        { abortEarly: false }
      );
      return next();
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        next(
          new AppError(
            'Validation errors',
            400,
            Reasons.InvalidRequest
          ).addData({ errors: err.errors })
        );

        return;
      }

      next(err);
    }
  };
