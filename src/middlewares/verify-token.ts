import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { TokenInterface } from '../types/index.js';

export default (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: 'Unauthorized',
      error_message: 'The Authorization header is required and must specify a valid user access token.'
    });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET) as TokenInterface;
    req.jwt = payload;

    next();
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized', error_message: 'The user access token is not valid' });
  }
};
