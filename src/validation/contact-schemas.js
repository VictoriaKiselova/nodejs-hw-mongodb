import Joi from 'joi';
import { contactType, validEmail } from '../constants/contact-constancts.js';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Username should be a string',
    'string.min': 'Username should have at least 3 characters',
    'string.max': 'Username should have at most 20 characters',
    'any.required': 'Username is required',
  }),
  phoneNumber: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().pattern(validEmail).min(3).max(20),
  isFavourite: Joi.boolean().default(false),
  contactType: Joi.string()
    .valid(...contactType)
    .min(3)
    .max(20)
    .default('personal')
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).messages({
    'string.base': 'Username should be a string',
    'string.min': 'Username should have at least 3 characters',
    'string.max': 'Username should have at most 20 characters',
  }),
  phoneNumber: Joi.string().min(3).max(20),
  email: Joi.string().email().pattern(validEmail).min(3).max(20),
  isFavourite: Joi.boolean().default(false),
  contactType: Joi.string()
    .valid(...contactType)
    .min(3)
    .max(20)
    .default('personal'),
});
