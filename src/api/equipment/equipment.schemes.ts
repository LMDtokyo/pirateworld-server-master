import Joi from 'joi';

const equipItemSchema = Joi.object({
    itemId: Joi.string().required()
});

const unequipItemSchema = Joi.object({
    equipmentId: Joi.number().required()
});

export { equipItemSchema, unequipItemSchema };
