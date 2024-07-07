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
  const { id } = req.params;
  const contact = await getContactByFilter({ _id: id, userId });

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
    message: `Successfully found contact with id ${id}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const { _id: userId } = req.user;

  const contact = await createContact(...req.body, userId);
  res.status(201).json({
    status: 201,
    message: `Successfully created a contact!`,
    data: contact,
  });
};

export const updateContactController = async (req, res, next) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const result = await updateContact({ _id: id, userId }, req.body, {
    upsert: true,
  });

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
  const { id } = req.params;
  const { _id: userId } = req.user;
  const result = await deleteContact({ _id: id, userId });

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
