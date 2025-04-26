import { Router } from 'express';
import verifyToken from '../../middlewares/verify-token.js';
import validateSchema from '../../middlewares/validate-schema.js';
import { equipItemSchema, unequipItemSchema } from './equipment.schemes.js';
import EquipmentController from './equipment.controller.js';

const router = Router();

router.get('/', verifyToken, EquipmentController.getEquipment);
router.post('/equip', verifyToken, validateSchema(equipItemSchema, 'body'), EquipmentController.equipItem);
router.post('/unequip', verifyToken, validateSchema(unequipItemSchema, 'body'), EquipmentController.unequipItem);

export default router;
