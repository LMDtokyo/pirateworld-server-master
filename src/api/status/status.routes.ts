import { Router } from 'express';
import verifyToken from '../../middlewares/verify-token.js';
import StatusController from './status.controller.js';
import validateSchema from '../../middlewares/validate-schema.js';
import { statusIdSchema } from './status.schemes.js';

const router = Router();

router.post('/active', verifyToken, StatusController.updateActive);
router.get('/:id', validateSchema(statusIdSchema, 'params'), StatusController.getStatus);

export default router;
