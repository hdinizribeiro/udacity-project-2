import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { User } from '../../models/user';

const jwtSecret = process.env.TOKEN_SECRET ?? '';

const jwtValidationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      res.status(401).send('Unauthorized');
      return;
    }

    const token = authorizationHeader.split(' ')[1];
    const decodedToken = (await jwt.verify(token, jwtSecret)) as jwt.JwtPayload;
    req.user = decodedToken as User;
  } catch (error) {
    res.status(401).send('Unauthorized');
    return;
  }

  next();
};

export { jwtValidationMiddleware };
