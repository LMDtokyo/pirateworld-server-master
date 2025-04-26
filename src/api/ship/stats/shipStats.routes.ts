import { Router } from 'express';
import verifyToken from '../../../middlewares/verify-token.js';
import ShipStatsController from './shipStats.controller.js';

const router = Router();

router.get('/stats', verifyToken, ShipStatsController.calculateShipStats);

export default router;
