import Joi from 'joi';

const playerIdSchema = Joi.object({
    id: Joi.string().regex(/^\d+$/).required()
});

const playerIncludeSchema = Joi.object({
    include: Joi.array().optional().items(Joi.string().valid('resources', 'exp', 'inventoryId'))
});

export { playerIdSchema, playerIncludeSchema }