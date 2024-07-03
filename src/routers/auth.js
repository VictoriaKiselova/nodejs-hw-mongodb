import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { userSignupSchema, userSigninSchema } from '../validation/auth.js';
import { registerUserController } from '../controllers/auth.js';
import validateBody from '../middlewares/validatebody.js';

const router = Router();

router.post(
  '/register',
  validateBody(userSignupSchema),
  ctrlWrapper(registerUserController),
);

export default router;
