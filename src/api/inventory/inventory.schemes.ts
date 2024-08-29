import Joi from 'joi';

const inventoryIdSchema = Joi.object({
  id: Joi.string().regex(/^\d+$/).required()
});

const inventoryMoveSchema = Joi.object({
  from: Joi.number().min(1).required(),
  to: Joi.number().min(1).required()
});

export { inventoryIdSchema, inventoryMoveSchema }