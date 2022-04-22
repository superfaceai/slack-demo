const { readFile, writeFile } = require('fs/promises');
const { clientId, clientSecret, tokensFile } = require('./config');
const { SuperfaceClient } = require('@superfaceai/one-sdk');

const sdk = new SuperfaceClient();

let _tokensCache;

async function loadTokens() {
  try {
    const contents = await readFile(tokensFile, { encoding: 'utf-8' });
    const parsed = JSON.parse(contents);
    return parsed;
  } catch (err) {
    throw new Error('Failed to load tokens', { cause: err });
  }
}

async function getTokens() {
  if (!_tokensCache) {
    _tokensCache = await loadTokens();
  }
  return _tokensCache;
}

async function saveTokens(newTokens) {
  return await writeFile(tokensFile, JSON.stringify(newTokens), {
    encoding: 'utf-8',
  });
}

async function getRefreshedTokens() {
  console.error('Refreshing token');

  const tokens = await getTokens();
  const profile = await sdk.getProfile('oauth2/refresh-token');
  const result = await profile
    .getUseCase('GetAccessTokenFromRefreshToken')
    .perform({
      refreshToken: tokens.refreshToken,
      clientId,
      clientSecret,
    });

  const data = result.unwrap();
  const expiresAt = Date.now() + data.expiresIn * 1000;

  return { ...data, expiresAt };
}

async function refreshToken() {
  const newTokens = await getRefreshedTokens();
  await saveTokens(newTokens);
  _tokensCache = newTokens;
  return _tokensCache;
}

/**
 * Passes current access token to the passed `perform` function and retries it with refreshed token if any exception occurs.
 */
async function withAccessToken(perform) {
  const tokens = await getTokens();
  try {
    return await perform(tokens.accessToken);
  } catch (err) {
    console.error('Error, refreshing token', err);
    const { accessToken } = refreshToken();
    return await perform(accessToken);
  }
}

module.exports = { withAccessToken };
