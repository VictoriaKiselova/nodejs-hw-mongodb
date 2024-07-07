import Joi from 'joi';
import { validEmail } from '../constants/contact-constancts.js';

export const userSignupSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().pattern(validEmail).min(3).max(20).required(),
  password: Joi.string().min(6).required(),
});

export const userSigninSchema = Joi.object({
  email: Joi.string().email().pattern(validEmail).required(),
  password: Joi.string().required(),
});
