import Joi from 'joi';

const signinSchema = Joi.object<{ login: string; password: string }>({
  login: Joi.string().alphanum().min(4).max(16).required(),
  password: Joi.string().min(6).max(30).required()
});

const signupSchema = Joi.object<{ login: string; password: string; email: string }>({
  login: Joi.string().alphanum().min(4).max(16).required(),
  password: Joi.string().min(6).max(30).required(),
  email: Joi.string().email().required()
});

const refreshSchema = Joi.object<{ refresh_token: string }>({
  refresh_token: Joi.string().uuid({ version: 'uuidv4', separator: '-' })
});

export { signinSchema, signupSchema, refreshSchema };
