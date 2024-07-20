import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { userSignupSchema, userSigninSchema } from '../validation/auth.js';
import {
  registerUserController,
  loginUserController,
  refreshController,logoutController
} from '../controllers/auth.js';
import validateBody from '../middlewares/validatebody.js';

const router = Router();

router.post(
  '/register',
  validateBody(userSignupSchema),
  ctrlWrapper(registerUserController),
);

router.post(
  '/login',
  validateBody(userSigninSchema),
  ctrlWrapper(loginUserController),
);

router.post('/refresh', ctrlWrapper(refreshController));

router.post('/logout', ctrlWrapper(logoutController));

export default router;
