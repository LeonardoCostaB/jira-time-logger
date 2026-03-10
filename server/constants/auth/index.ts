const EXPIRES_IN_ACCESS_TOKEN = 1000 * 60 * 60 * 24 * 1; // 1 day in milliseconds
const EXPIRES_IN_REFRESH_TOKEN = 1000 * 60 * 60 * 24 * 30; // 30 days in milliseconds

const ACCESS_TOKEN_NAME = 'client-access-token';
const REFRESH_TOKEN_NAME = 'client-refresh-token';

export { 
  EXPIRES_IN_ACCESS_TOKEN, 
  EXPIRES_IN_REFRESH_TOKEN, 
  ACCESS_TOKEN_NAME, 
  REFRESH_TOKEN_NAME 
};