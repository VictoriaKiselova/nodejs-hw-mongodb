import Joi from 'joi';
import { validEmail } from '../constants/contact-constancts.js';

export const userSignupSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().pattern(validEmail).required(),
  password: Joi.string().min(6).required(),
});

export const userSigninSchema = Joi.object({
  email: Joi.string().email().pattern(validEmail).required(),
  password: Joi.string().required(),
});

export const requestResetEmailSchema = Joi.object({
  email: Joi.string().email().pattern(validEmail).required(),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string().required(),
  token: Joi.string().required(),
});

export const userGoogleAuthCodeShema = Joi.object({
  code: Joi.string().required(),
});
