import Joi from 'joi';

const signinSchema = Joi.object<{ login: string; password: string }>({
  login: Joi.string().alphanum().min(4).max(16).required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
});

const signupSchema = Joi.object<{ login: string; password: string; email: string }>({
  login: Joi.string().alphanum().min(4).max(16).required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  email: Joi.string().email().required()
});

const refreshSchema = Joi.object<{ refresh_token: string }>({
  refresh_token: Joi.string().uuid({ version: 'uuidv4', separator: '-' })
});

export { signinSchema, signupSchema, refreshSchema };
