export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'invalid_credentials',
  USER_EXISTS: 'user_already_exists',
  RATE_LIMIT: 'over_email_send_rate_limit',
} as const;

export const getAuthErrorMessage = (error: any): string => {
  if (!error) return 'Erro desconhecido';

  const code = error.code || error?.error?.code;
  
  switch (code) {
    case AUTH_ERRORS.INVALID_CREDENTIALS:
      return 'Email ou senha inválidos';
    case AUTH_ERRORS.USER_EXISTS:
      return 'Usuário já cadastrado. Tente fazer login.';
    case AUTH_ERRORS.RATE_LIMIT:
      return 'Muitas tentativas. Aguarde alguns segundos e tente novamente.';
    default:
      return error.message || 'Erro ao processar sua solicitação';
  }
};
