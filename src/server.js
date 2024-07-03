import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pino from 'pino-http';
// import router from './routers/contacts.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
// import authRegisterRouter from './routers/auth.js';
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
  app.use(router);
  app.use(cors());
  app.use(logger);
  app.use(
    express.json({
      type: ['application/json', 'application/vnd.api+json'],
    }),
  );

  // app.use('/auth/register',authRegisterRouter);
  // app.use('/contacts', routers);
  app.use('*', notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
