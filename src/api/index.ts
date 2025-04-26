import { Router } from 'express';
import verifyToken from '../middlewares/verify-token.js';

import authRoutes from './auth/auth.routes.js';
import playersRoutes from './players/players.routes.js';
import inventoryRoutes from './inventory/inventory.routes.js';
import statusRoutes from './status/status.routes.js';
import avatarRoutes from './avatar/avatar.routes.js';

const router = Router();

// Роуты без авторизации
router.use('/auth', authRoutes);

// Роуты с авторизацией
router.use('/players', verifyToken, playersRoutes);
router.use('/inventory', verifyToken, inventoryRoutes);
router.use('/status', verifyToken, statusRoutes);
router.use('/avatar', verifyToken, avatarRoutes);

export default router;
