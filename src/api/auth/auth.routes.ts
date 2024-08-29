import { Router } from 'express';

import verifyToken from '../../middlewares/verify-token.js';
import validateSchema from '../../middlewares/validate-schema.js';
import { signinSchema, signupSchema, refreshSchema } from './auth.schemes.js';

import AuthController from './auth.controller.js';

const router = Router();

router.post('/signin', validateSchema(signinSchema, 'body'), AuthController.signin);
router.post('/signup', validateSchema(signupSchema, 'body'), AuthController.signup);
router.post('/token/refresh', validateSchema(refreshSchema, 'body'), AuthController.refresh);
router.post('/token/revoke', validateSchema(refreshSchema, 'body'), AuthController.revoke);
router.get('/me', verifyToken, AuthController.me);

export default router;
