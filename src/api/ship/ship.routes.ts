import { Router } from 'express';
import verifyToken from '../../middlewares/verify-token.js';
import validateSchema from '../../middlewares/validate-schema.js';
import { equipShipSchema, addCrewSchema } from './ship.schemes.js';
import ShipController from './ship.controller.js';

const router = Router();

router.get('/', verifyToken, ShipController.getShip);
router.post('/equip', verifyToken, validateSchema(equipShipSchema, 'body'), ShipController.equipShip);
router.post('/crew', verifyToken, validateSchema(addCrewSchema, 'body'), ShipController.addCrew);

export default router;
