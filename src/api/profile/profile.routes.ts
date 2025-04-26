import { Router } from 'express';
import verifyToken from '../../middlewares/verify-token.js';
import ProfileController from './profile.controller.js';

const router = Router();

router.get('/', verifyToken, ProfileController.getProfile);

export default router;
