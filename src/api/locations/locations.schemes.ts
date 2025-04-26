import Joi from 'joi';

const locationIdSchema = Joi.object({
    id: Joi.string().regex(/^\d+$/).required()
});

export { locationIdSchema };
