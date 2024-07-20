import path from 'node:path';

export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

export const FIFTEEN_MINUTES = 15 * 60 * 1000;
export const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

export const SMTP = {
  SMTP_HOST: 'SMTP_HOST',
  SMTP_PORT: 'SMTP_PORT',
  SMTP_USER: 'SMTP_USER',
  SMTP_PASSWORD: 'SMTP_PASSWORD',
  SMTP_FROM: 'SMTP_FROM',
};

export const TEMPLATES_DIR = path.resolve('src', 'templates');
export const TEMP_UPLOAD_DIR = path.resolve('src', 'temp');
export const PUBLIC_DIR = path.resolve('src', 'public');
export const PUBLIC_PHOTOS_DIR = path.resolve('src', 'public', 'photos');
export const SWAGGER_PATH = path.resolve('docs', 'swagger.json');
