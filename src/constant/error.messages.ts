export const ERROR_MESSAGES = {
  // Common errors
  VALIDATION_ERROR: 'Validation error',

  // Auth errors
  INVALID_CREDENTIALS: 'Invalid credentials',
  LOGIN_FAILED: 'Login failed',
  PROFILE_FETCH_FAILED: 'Failed to get profile',
  NO_TOKEN: 'No token provided',
  INVALID_TOKEN: 'Invalid token',

  // User errors
  UPDATE_FAILED: 'Failed to update user',
  USER_NOT_FOUND: 'User not found',
  USER_EXISTS: 'User already exists',
  GET_USER_FAILED: 'Failed to get user',
  USER_CREATION_FAILED: 'Failed to create user',
  DELETE_FAILED: 'Failed to delete user',
  REGISTRATION_FAILED: 'Registration failed',
  FORBIDDEN: 'Forbidden error',
} as const;
