import { Request, Response, NextFunction } from 'express';

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction) => {
  const error = new Error(`Route ${req.originalUrl} not found`) as any;
  error.statusCode = 404;
  error.isOperational = true;
  next(error);
};
