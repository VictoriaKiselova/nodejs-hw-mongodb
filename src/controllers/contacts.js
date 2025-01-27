import {
  getAllContacts,
  getContactByFilter,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import parsePaginationParams from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { saveFileToPublicDir } from '../utils/saveFileToPublicDir.js';
import { env } from '../utils/env.js';

const enable_cloudinary = env('ENABLE_CLOUDINARY');

export const getContactsController = async (req, res, next) => {
  const { _id: userId } = req.user;

  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = { ...parseFilterParams(req.query), userId };

  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  if (contacts.data.length === 0) {
    next(
      createHttpError(404, {
        status: 404,
        message: 'Сontact not found',
      }),
    );
  }

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { _id: userId } = req.user;
  const { contactId } = req.params;
  const contact = await getContactByFilter({ _id: contactId, userId });

  if (!contact) {
    next(
      createHttpError(404, {
        status: 404,
        message: 'Сontact not found',
        data: { message: 'Contact not found' },
      }),
    );
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const { _id: userId } = req.user;
  let photo = '';

  if (req.file) {
    if (enable_cloudinary === 'true') {
      photo = await saveFileToCloudinary(req.file, 'photo');
    } else {
      photo = await saveFileToPublicDir(req.file, 'photos');
    }
  }

  const contact = await createContact({ ...req.body, userId, photo });
  res.status(201).json({
    status: 201,
    message: `Successfully created a contact!`,
    data: contact,
  });
};

export const updateContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;
  let photo = '';

  if (req.file) {
    if (enable_cloudinary === 'true') {
      photo = await saveFileToCloudinary(req.file, 'photo');
    } else {
      photo = await saveFileToPublicDir(req.file, 'photos');
    }
  }

  const result = await updateContact(
    { _id: contactId, userId },
    {
      ...req.body,
      photo: photo,
    },
    {
      upsert: true,
    },
  );

  if (!result) {
    next(
      createHttpError(404, {
        status: 404,
        message: 'Сontact not found',
        data: { message: 'Contact not found' },
      }),
    );
  }

  res.json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: result,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;
  const result = await deleteContact({ _id: contactId, userId });

  if (!result) {
    next(
      createHttpError(404, {
        status: 404,
        message: 'Сontact not found',
        data: { message: 'Contact not found' },
      }),
    );
    return;
  }

  res.status(204).send();
};
