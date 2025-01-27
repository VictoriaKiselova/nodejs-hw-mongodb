import createHttpError from 'http-errors';
import { compareHash } from '../utils/hash.js';
import {
  registerUser,
  findUser,
  createSession,
  findSession,
  deleteSession,
  requestResetToken,
} from '../services/auth.js';
import { resetPassword } from '../services/auth.js';
import {
  generateAuthUrl,
  validateGoogleAuthCode,
  getGoogleAuthName,
} from '../utils/googleAuth.js';
import { randomBytes } from 'node:crypto';

const setupResponseSession = (
  res,
  { refreshToken, refreshTokenValidUntil, _id },
) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    expires: refreshTokenValidUntil,
  });

  res.cookie('sessionId', _id, {
    httpOnly: true,
    expires: refreshTokenValidUntil,
  });
};

export const registerUserController = async (req, res) => {
  const { email } = req.body;
  const user = await findUser({ email });
  if (user) {
    throw createHttpError(409, 'Email in use');
  }
  const newUser = await registerUser(req.body);
  const data = {
    name: newUser.name,
    email: newUser.email,
  };

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data,
  });
};

export const loginUserController = async (req, res) => {
  const { email, password } = req.body;
  const user = await findUser({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const passwordCompare = await compareHash(password, user.password);
  if (!passwordCompare) {
    throw createHttpError(401, 'Unauthorized');
  }
  const session = await createSession(user._id);

  setupResponseSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: { accessToken: session.accessToken },
  });
};

export const refreshController = async (req, res) => {
  const { refreshToken, sessionId } = req.cookies;
  const currentSession = await findSession({ _id: sessionId, refreshToken });
  if (!currentSession) {
    throw createHttpError(401, 'Session not found');
  }
  const refreshTokenExpired =
    Date.now() > new Date(currentSession.refreshTokenValidUntil);
  if (refreshTokenExpired) {
    throw createHttpError(401, 'Session expired');
  }
  const newSession = await createSession(currentSession.userId);

  setupResponseSession(res, newSession);
  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: { accessToken: newSession.accessToken },
  });
};

export const logoutController = async (req, res) => {
  const { sessionId } = req.cookies;
  if (!sessionId) {
    throw createHttpError(401, 'Session not found');
  }
  await deleteSession({ _id: sessionId });
  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');
  res.status(204).send();
};

export const requestResetEmailController = async (req, res) => {
  await requestResetToken(req.body.email);
  try {
    res.json({
      status: 200,
      message: 'Reset password email was successfully sent!',
      data: {},
    });
  } catch {
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);
  res.json({
    status: 200,
    message: 'Password was successfully reset!',
    data: {},
  });
};

export const getGoogleAuthUrlController = async (req, res) => {
  const url = generateAuthUrl();
  res.json({
    status: 200,
    message: 'Google Auth url generate successfully',
    data: {
      url,
    },
  });
};

export const authGoogleController = async (req, res) => {
  const { code } = req.body;
  const payload = await validateGoogleAuthCode(code);
  const userPayload = payload.getPayload();
  if (userPayload) {
    throw createHttpError(401);
  }
  let user = await findUser({
    email: userPayload.email,
  });
  if (!user) {
    const signupData = {
      email: userPayload.email,
      password: randomBytes(10),
      name: getGoogleAuthName(userPayload),
    };
    user = await registerUser(signupData);
  }
  const newSession = await createSession(user.userId);

  setupResponseSession(res, newSession);
  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: { accessToken: newSession.accessToken },
  });
};
