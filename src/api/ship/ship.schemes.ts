import Joi from 'joi';

const equipShipSchema = Joi.object({
    type: Joi.string().valid('cannon', 'sail', 'armor', 'mortar').required(),
    bonusAttack: Joi.number().optional(),
    bonusSpeed: Joi.number().optional(),
    bonusDefense: Joi.number().optional(),
    bonusDamage: Joi.number().optional()
});

const addCrewSchema = Joi.object({
    role: Joi.string().valid('cook', 'captain', 'slave', 'repairman', 'sailor').required(),
    bonusHp: Joi.number().optional(),
    bonusAttack: Joi.number().optional(),
    bonusSpeed: Joi.number().optional(),
    bonusDefense: Joi.number().optional(),
    bonusLuck: Joi.number().optional(),
    bonusRepairSpeed: Joi.number().optional()
});

export { equipShipSchema, addCrewSchema };
