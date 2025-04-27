import Joi from 'joi';

const learnPassiveSkillSchema = Joi.object({
    passiveId: Joi.number().integer().required()
});

export { learnPassiveSkillSchema };
