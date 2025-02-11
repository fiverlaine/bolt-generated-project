import { AuthError } from '@supabase/supabase-js';

export const handleAuthError = (error: unknown): { success: false; error: string } => {
  console.error('Auth error:', error);

  if (error instanceof AuthError) {
    switch (error.status) {
      case 400:
        return { success: false, error: 'Email inválido' };
      case 429:
        return { success: false, error: 'Muitas tentativas. Aguarde alguns segundos.' };
      default:
        return { success: false, error: 'Erro ao fazer login. Tente novamente.' };
    }
  }

  return { success: false, error: 'Erro ao fazer login. Tente novamente.' };
};
