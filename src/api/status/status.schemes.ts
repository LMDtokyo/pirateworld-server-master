import Joi from 'joi';

const statusIdSchema = Joi.object({
    id: Joi.string().regex(/^\d+$/).required()
});

export { statusIdSchema };
