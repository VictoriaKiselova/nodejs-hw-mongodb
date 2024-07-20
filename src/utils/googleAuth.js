import { OAuth2Client } from 'google-auth-library';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { env } from './env.js';
import createHttpError from 'http-errors';

const googleAuthSettingsPath = path.resolve('google-auth.json');
const googleAuthSettings = JSON.parse(await readFile(googleAuthSettingsPath));

const clientId = env('GOOGLE_AUTH_CLIENT_ID');
const clientSecret = env('GOOGLE_AUTH_CLIENT_SECRET');

const gogleAuthClient = new OAuth2Client({
  clientId,
  clientSecret,
  redirectUri: googleAuthSettings.web.redirect_uris[0],
});

export const validateGoogleAuthCode = async (code) => {
  const response = await gogleAuthClient.getToken(code);
  if (!response.tokens.id_token) {
    throw createHttpError(401, 'Google Auth code invalid');
  }
  const ticket = await gogleAuthClient.verifyIdToken({
    idToken: response.tokens.id_token,
  });
  return ticket;
};

export const getGoogleAuthName = ({ given_name, family_name }) => {
  if (!given_name) return 'User';
  const name = family_name ? `${given_name} ${family_name}` : given_name;
  return name;
};

export const generateAuthUrl = () => {
  return gogleAuthClient.generateAuthUrl({
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  });
};
