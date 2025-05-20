export const ERROR_MESSAGES = {
  // Auth errors
  USER_EXISTS: 'User already exists',
  INVALID_CREDENTIALS: 'Invalid credentials',
  USER_NOT_FOUND: 'User not found',
  VALIDATION_ERROR: 'Validation error',
  REGISTRATION_FAILED: 'Registration failed',
  LOGIN_FAILED: 'Login failed',
  PROFILE_FETCH_FAILED: 'Failed to get profile',
  DELETE_FAILED: 'Failed to delete user',
  NO_TOKEN: 'No token provided',
  INVALID_TOKEN: 'Invalid token',
  
  // User errors
  UPDATE_FAILED: 'Failed to update user',
  GET_USER_FAILED: 'Failed to get user',
  USER_CREATION_FAILED: 'Failed to create user'
} as const;