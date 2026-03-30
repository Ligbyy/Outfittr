const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';
const TOKEN_STORAGE_KEY = 'outfittr.jwt';
const COGNITO_REGION = process.env.REACT_APP_COGNITO_REGION || 'us-east-1';
const COGNITO_CLIENT_ID =
  process.env.REACT_APP_COGNITO_CLIENT_ID || '2qlg1os2kkpdbulfhlt48cptq4';

function buildUrl(path) {
  return `${API_BASE_URL}${path}`;
}

function getCognitoEndpoint() {
  return `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/`;
}

async function requestJson(path, options) {
  const response = await fetch(buildUrl(path), {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options && options.headers ? options.headers : {})
    },
    ...options
  });

  let payload = null;

  try {
    payload = await response.json();
  } catch (error) {
    payload = null;
  }

  if (!response.ok) {
    const errorMessage =
      payload && (payload.message || payload.error) ?
      (payload.message || payload.error) :
      'Request failed.';

    const requestError = new Error(errorMessage);
    requestError.status = response.status;
    requestError.payload = payload;
    throw requestError;
  }

  return payload || {};
}

export function extractToken(payload) {
  if (!payload) {
    return null;
  }

  const authResult =
    payload.AuthenticationResult ||
    (payload.data && payload.data.AuthenticationResult) ||
    payload.authenticationResult ||
    (payload.data && payload.data.authenticationResult) ||
    null;

  return payload.token ||
    payload.jwt ||
    payload.accessToken ||
    payload.idToken ||
    payload.access_token ||
    payload.id_token ||
    payload.AccessToken ||
    payload.IdToken ||
    (authResult && (
      authResult.AccessToken ||
      authResult.IdToken ||
      authResult.accessToken ||
      authResult.idToken
    )) ||
    (payload.data && (
      payload.data.token ||
      payload.data.jwt ||
      payload.data.accessToken ||
      payload.data.idToken ||
      payload.data.access_token ||
      payload.data.id_token ||
      payload.data.AccessToken ||
      payload.data.IdToken
    )) ||
    null;
}

export function storeToken(token) {
  if (token) {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  }
}

export function getStoredToken() {
  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function clearStoredToken() {
  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
}

function shouldUseCognitoFallback(error) {
  return !error.status || error.status === 404 || error.status === 405;
}

async function requestCognito(target, body) {
  const response = await fetch(getCognitoEndpoint(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-amz-json-1.1',
      'X-Amz-Target': `AWSCognitoIdentityProviderService.${target}`
    },
    body: JSON.stringify(body)
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.message || payload.__type || 'Cognito request failed.');
  }

  return payload;
}

async function loginWithCognito(credentials) {
  const payload = await requestCognito('InitiateAuth', {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: COGNITO_CLIENT_ID,
    AuthParameters: {
      USERNAME: credentials.username,
      PASSWORD: credentials.password
    }
  });

  const authResult = payload.AuthenticationResult || {};

  return {
    accessToken: authResult.AccessToken,
    idToken: authResult.IdToken,
    refreshToken: authResult.RefreshToken,
    provider: 'cognito'
  };
}

async function registerWithCognito(user) {
  const payload = await requestCognito('SignUp', {
    ClientId: COGNITO_CLIENT_ID,
    Username: user.username,
    Password: user.password,
    UserAttributes: [
      {
        Name: 'email',
        Value: user.email
      },
      {
        Name: 'given_name',
        Value: user.firstName
      },
      {
        Name: 'family_name',
        Value: user.lastName
      }
    ]
  });

  return {
    userConfirmed: payload.UserConfirmed,
    username: payload.UserSub || user.username,
    provider: 'cognito'
  };
}

export async function loginUser(credentials) {
  try {
    return await requestJson('/api/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  } catch (error) {
    if (!shouldUseCognitoFallback(error)) {
      throw error;
    }

    return loginWithCognito(credentials);
  }
}

export async function registerUser(user) {
  const requestBody = {
    username: user.username,
    email: user.email,
    password: user.password,
    firstName: user.firstName,
    lastName: user.lastName,
    first_name: user.firstName,
    last_name: user.lastName,
    given_name: user.firstName,
    family_name: user.lastName
  };

  try {
    return await requestJson('/api/users/register', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    });
  } catch (error) {
    if (!shouldUseCognitoFallback(error)) {
      throw error;
    }

    return registerWithCognito(user);
  }
}

export function getAuthHeaders() {
  const token = getStoredToken();

  return token ? {'x-access-token': token} : {};
}
