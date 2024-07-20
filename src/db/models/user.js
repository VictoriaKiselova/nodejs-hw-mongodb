import { model, Schema } from 'mongoose';
import { validEmail } from '../../constants/contact-constancts.js';
import { mongooseSaveError, setUpdateSettings } from './hooks.js';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      match: validEmail,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

userSchema.post('save', mongooseSaveError);
userSchema.pre('findOneAndUpdate', setUpdateSettings);
userSchema.post('findOneAndUpdate', mongooseSaveError);

export const User = model('user', userSchema);
