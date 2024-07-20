import { PUBLIC_DIR } from '../constants/index.js';
import path from 'node:path';
import fs from 'node:fs/promises';
import { env } from './env.js';

const domian = env('APP_DOMAIN');

export const saveFileToPublicDir = async (file, filePath) => {
  const newPath = path.join(PUBLIC_DIR, filePath, file.filename);
  await fs.rename(file.path, newPath);

  return `${domian}/public/${filePath}/${file.filename}`;
};
