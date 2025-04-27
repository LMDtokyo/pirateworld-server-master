import { Router } from 'express';
import verifyToken from '../../middlewares/verify-token.js';
import TalentsController from './talents.controller.js';

const router = Router();

router.post('/learn', verifyToken, TalentsController.learnTalent);
router.post('/reset', verifyToken, TalentsController.resetTalents);
router.get('/me', verifyToken, TalentsController.getMyTalents); // 🎯 Новый метод

export default router;
