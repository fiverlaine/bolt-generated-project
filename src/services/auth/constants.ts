export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid login credentials',
  USER_EXISTS: 'User already registered',
  RATE_LIMIT: 'Too many requests',
} as const;

export const AUTH_MESSAGES = {
  LOGIN_ERROR: 'Erro ao fazer login. Tente novamente.',
  RATE_LIMIT: 'Muitas tentativas. Aguarde alguns segundos.',
  INVALID_EMAIL: 'Email inválido',
} as const;

export const RATE_LIMIT = {
  MAX_ATTEMPTS: 3,
  COOLDOWN_MS: 30000, // 30 seconds
} as const;
