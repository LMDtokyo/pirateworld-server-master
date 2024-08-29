import { Router } from 'express';
import verifyToken from '../middlewares/verify-token.js';

import authRoutes from './auth/auth.routes.js';
import playersRoutes from './players/players.routes.js';
import inventoryRoutes from './inventory/inventory.routes.js'

const router = Router();

router.use('/auth', authRoutes);
router.use('/players', verifyToken, playersRoutes);
router.use('/inventory', verifyToken, inventoryRoutes);

export default router;
