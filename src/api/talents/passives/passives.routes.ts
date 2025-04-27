import { Router } from 'express';
import verifyToken from '../../../middlewares/verify-token.js';
import validateSchema from '../../../middlewares/validate-schema.js';
import { learnPassiveSkillSchema } from './passives.schemes.js';
import PassivesController from './passives.controller.js';

const router = Router();

router.get('/tree', verifyToken, PassivesController.getPassiveSkills);
router.get('/me', verifyToken, PassivesController.getMyPassiveSkills); // 🎯 Новое
router.post('/learn', verifyToken, validateSchema(learnPassiveSkillSchema, 'body'), PassivesController.learnPassiveSkill);
router.post('/reset', verifyToken, PassivesController.resetMyPassiveSkills); // 🎯 Новое

export default router;
