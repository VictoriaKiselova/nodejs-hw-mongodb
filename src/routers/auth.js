import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  userSignupSchema,
  userSigninSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
  userGoogleAuthCodeShema,
} from '../validation/auth.js';
import {
  registerUserController,
  loginUserController,
  refreshController,
  logoutController,
  requestResetEmailController,
  resetPasswordController,
  getGoogleAuthUrlController,
  authGoogleController,
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

router.post(
  '/send-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);

router.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

router.get('/get-auth-url', ctrlWrapper(getGoogleAuthUrlController));

router.post(
  '/confirm-google-oauth',
  validateBody(userGoogleAuthCodeShema),
  ctrlWrapper(authGoogleController),
);

router.post('/refresh', ctrlWrapper(refreshController));

router.post('/logout', ctrlWrapper(logoutController));

export default router;
