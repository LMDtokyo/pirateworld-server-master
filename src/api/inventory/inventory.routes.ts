import { Router } from "express";

const router = Router();

import validateSchema from "../../middlewares/validate-schema.js";
import { inventoryIdSchema, inventoryMoveSchema } from "./inventory.schemes.js";
import InventoryController from "./inventory.controller.js";

router.get('/:id', validateSchema(inventoryIdSchema, 'params'), InventoryController.fetch);
router.post('/:id/move', validateSchema(inventoryIdSchema, 'params'), validateSchema(inventoryMoveSchema, 'body'), InventoryController.move);
export default router;