import { Request, Response, NextFunction } from 'express';

export default (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Error', error_message: 'Unhandled error, please try again later.' });
};
