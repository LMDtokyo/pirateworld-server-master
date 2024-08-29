import type { ObjectSchema } from 'joi';
import type { NextFunction, Request, Response } from 'express';

export default <T = unknown>(schema: ObjectSchema, validate: 'body' | 'params' | 'query') => {
  return (req: Request<T, T, T>, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req[validate]);

    if (error) return res.status(400).json({ error: 'Validate Error', error_message: error.message });

    next();
  };
};
