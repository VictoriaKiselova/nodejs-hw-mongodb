import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pino from 'pino-http';
import { getAllContacts, getContactById } from './services/contacts.js';

dotenv.config();
const { PORT } = process.env;

export default function setupServer() {
  const app = express();
  const logger = pino({
    transport: {
      target: 'pino-pretty',
    },
  });

  app.use(express.json());
  app.use(cors());
  app.use(logger);

  app.get('/contacts', async (req, res) => {
    try {
      const contacts = await getAllContacts();
      const responseData = {
        status: 'success',
        message: 'Successfully found contacts!',
        data: contacts,
      };
      res.status(200).json(responseData);
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'An error occurred while retrieving contacts',
        data: null,
      });
    }
  });

  app.get('/contacts/:contactId', async (req, res) => {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);
    if (!contact) {
      res.status(404).json({
        message: 'Contact not found',
      });
      return;
    }
    res.status(200).json({
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  });

  app.use('*', (req, res) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
