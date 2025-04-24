import { Router } from 'express';

import validateSchema from '../../middlewares/validate-schema.js';
import { playerIdSchema, playerIncludeSchema } from './players.schemes.js';

import PlayersController from './players.controller.js';
const router = Router();

router.get(
  '/:id',
  validateSchema(playerIdSchema, 'params'),
  validateSchema(playerIncludeSchema, 'query'),
  PlayersController.player
);

export default router;
