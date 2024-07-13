import { model, Schema } from 'mongoose';
import { contactType, validEmail } from '../../constants/contact-constancts.js';
import { mongooseSaveError, setUpdateSettings } from './hooks.js';

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20,
    },
    phoneNumber: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20,
    },
    email: {
      type: String,
      match: [validEmail, 'Please enter a valid email address'],
      minlength: 3,
      maxlength: 20,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: contactType,
      default: 'personal',
      required: true,
      minlength: 3,
      maxlength: 20,
    },
    photo: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

contactSchema.post('save', mongooseSaveError);
contactSchema.pre('findOneAndUpdate', setUpdateSettings);
contactSchema.post('findOneAndUpdate', mongooseSaveError);

export const Contact = model('contacts', contactSchema);
