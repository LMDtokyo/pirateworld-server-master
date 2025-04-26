import { Router } from 'express';
import validateSchema from '../../middlewares/validate-schema.js';
import verifyToken from '../../middlewares/verify-token.js';
import { locationIdSchema } from './locations.schemes.js';
import LocationsController from './locations.controller.js';

const router = Router();

router.get('/', verifyToken, LocationsController.getLocations);
router.post('/:id/enter', verifyToken, validateSchema(locationIdSchema, 'params'), LocationsController.enterLocation);

export default router;
