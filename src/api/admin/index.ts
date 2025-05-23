import { Router } from 'express';
import giveItemHandler from './inventory/give.js';
import createItemHandler from './item/create.js';

import punishUserHandler from './user/punish.js';
import listUsersHandler from './user/list.js';
import listPunishmentsHandler from './user/punishments.js';
import listItemsHandler from './item/list.js';

const router = Router();

router.post('/inventory/give', giveItemHandler);
router.post('/item/create', createItemHandler);
router.get('/items', listItemsHandler);

router.get('/users', listUsersHandler);
router.post('/punish', punishUserHandler);
router.get('/punishments', listPunishmentsHandler);

export default router;
