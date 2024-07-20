import { randomBytes } from 'crypto';
import { User } from '../db/models/user.js';
import { Session } from '../db/models/session.js';
import { hashValue } from '../utils/hash.js';
import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/index.js';

export const registerUser = async (payload) => {
  const { password } = payload;
  const hashPassword = await hashValue(password);

  return User.create({ ...payload, password: hashPassword });
};

export const createSession = async (userId) => {
  await Session.deleteOne({ userId });
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  const accessTokenValidUntil = new Date(Date.now() + FIFTEEN_MINUTES);
  const refreshTokenValidUntil = new Date(Date.now() + THIRTY_DAYS);

  return Session.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });
};

export const findUser = (filter) => User.findOne(filter);
export const findSession = (filter) => Session.findOne(filter);
export const deleteSession = (filter) => Session.deleteOne(filter);
