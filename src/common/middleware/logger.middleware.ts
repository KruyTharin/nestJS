import { NextFunction } from 'express';

export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('Middleware Request...', req.body);
  next();
};
