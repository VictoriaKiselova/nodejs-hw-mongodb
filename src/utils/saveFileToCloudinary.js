import { v2 as cloudinary } from 'cloudinary';
import { env } from './env.js';
// import { CLOUDINARY } from '../constants/index.js';

const cloud_name = env('CLOUD_NAME');
const api_secret = env('API_SECRET');
const api_key = env('API_KEY');

//  const  CLOUDINARY = {
//     CLOUD_NAME : 'CLOUD_NAME' ,
//    API_KEY: 'API_KEY' ,
//    API_SECRET: 'API_SECRET' ,
//   };

cloudinary.config({
  secure: true,
  cloud_name,
  api_secret,
  api_key,
});

export const saveFileToCloudinary = async (file, folder) => {
  const response = await cloudinary.uploader.upload(file.path, { folder });
  return response.secure_url;
};
