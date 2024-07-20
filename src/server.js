import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import pino from 'pino-http';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { PUBLIC_DIR } from './constants/index.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';
import router from './routers/index.js';

dotenv.config();
const { PORT } = process.env;

export default function setupServer() {
  const app = express();
  const logger = pino({
    transport: {
      target: 'pino-pretty',
    },
  });

  app.use(cors());
  app.use(cookieParser());
  app.use(logger);
  app.use(
    express.json({
      type: ['application/json', 'application/vnd.api+json'],
    }),
  );
  app.use(express.static(PUBLIC_DIR));
  app.use('/api-docs', swaggerDocs());
  app.use(router);

  app.use('*', notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
