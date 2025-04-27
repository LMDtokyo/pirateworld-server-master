import { Router } from 'express';
import verifyToken from '../middlewares/verify-token.js';

import authRoutes from './auth/auth.routes.js';
import playersRoutes from './players/players.routes.js';
import inventoryRoutes from './inventory/inventory.routes.js';
import statusRoutes from './status/status.routes.js';
import avatarRoutes from './avatar/avatar.routes.js';
import locationsRoutes from './locations/locations.routes.js';
import shipRoutes from './ship/ship.routes.js';
import shipStatsRoutes from './ship/stats/shipStats.routes.js';
import equipmentRoutes from './equipment/equipment.routes.js';
import profileRoutes from './profile/profile.routes.js';
import topRoutes from './top/top.routes.js';
import talentsRoutes from './talents/talents.routes.js';
import passivesRoutes from './talents/passives/passives.routes.js';

const router = Router();

// Роуты без авторизации
router.use('/auth', authRoutes);

// Роуты с авторизацией
router.use('/players', verifyToken, playersRoutes);
router.use('/inventory', verifyToken, inventoryRoutes);
router.use('/status', verifyToken, statusRoutes);
router.use('/avatar', verifyToken, avatarRoutes);
router.use('/locations', verifyToken, locationsRoutes);
router.use('/ship', verifyToken, shipRoutes);
router.use('/', shipStatsRoutes);
router.use('/equipment', equipmentRoutes);
router.use('/profile', profileRoutes);
router.use('/top', topRoutes);
router.use('/talents', talentsRoutes);
router.use('/passives', passivesRoutes);

export default router;
