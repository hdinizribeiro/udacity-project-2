import express, { Request, Response } from 'express';

const productRoutes = (app: express.Application) => {
  app.get('/products', index);
};

const index = async (_req: Request, res: Response) => {
  throw new Error('not implemented');
};

export default productRoutes;
