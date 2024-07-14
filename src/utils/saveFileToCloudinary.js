import { v2 as cloudinary } from 'cloudinary';
import fs from 'node:fs/promises';
import { env } from './env.js';

const cloud_name = env('CLOUD_NAME');
const api_secret = env('API_SECRET');
const api_key = env('API_KEY');

cloudinary.config({
  secure: true,
  cloud_name,
  api_secret,
  api_key,
});

export const saveFileToCloudinary = async (file, folder) => {
  const response = await cloudinary.uploader.upload(file.path, { folder });
  await fs.unlink(file.path);
  return response.secure_url;
};
