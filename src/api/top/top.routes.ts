import { Router } from 'express';
import verifyToken from '../../middlewares/verify-token.js';
import TopController from './top.controller.js';

const router = Router();

router.get('/', verifyToken, TopController.getTopPlayers);

export default router;
