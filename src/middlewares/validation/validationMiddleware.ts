import express from 'express';
import * as yup from 'yup';
import { ApiError, Reasons } from '../errorMiddleare/apiError';

export const validate =
  (schema: yup.BaseSchema) =>
  async (
    req: express.Request,
    _res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      await schema.validate({
        body: req.body,
        query: req.query,
        params: req.params
      });
      return next();
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        next(
          new ApiError(err.message, 400, Reasons.InvalidRequest).addData(
            'validation',
            err.errors
          )
        );
      }

      next(err);
    }
  };
