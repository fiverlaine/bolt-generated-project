import { emailAuth } from './strategies/emailAuth';
import { AuthResponse } from './types';
import { supabase } from '../supabase';

export class AuthService {
  private static instance: AuthService;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async signIn(email: string): Promise<AuthResponse> {
    try {
      // Try to get existing session first
      const { data: { session: existingSession } } = await supabase.auth.getSession();
      
      if (existingSession) {
        return {
          success: true,
          data: {
            session: existingSession,
            user: existingSession.user
          }
        };
      }

      // Try login first
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: email
      });

      if (!signInError && signInData.session) {
        return {
          success: true,
          data: signInData
        };
      }

      // If login fails, try signup
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password: email,
        options: {
          emailRedirectTo: window.location.origin,
          data: { email }
        }
      });

      if (!signUpError && signUpData.session) {
        // Try immediate login after signup
        const { data: newLoginData, error: newLoginError } = await supabase.auth.signInWithPassword({
          email,
          password: email
        });

        if (!newLoginError && newLoginData.session) {
          return {
            success: true,
            data: newLoginData
          };
        }
      }

      console.error('Auth error:', signUpError || signInError);
      return {
        success: false,
        error: 'Erro ao fazer login. Tente novamente.'
      };
    } catch (error) {
      console.error('Auth error:', error);
      return {
        success: false,
        error: 'Erro ao fazer login. Tente novamente.'
      };
    }
  }

  async signOut(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear any stored session data
      await supabase.auth.clearSession();
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  async refreshSession(): Promise<void> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;

      if (!session) {
        const { error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError) throw refreshError;
      }
    } catch (error) {
      console.error('Session refresh error:', error);
      throw error;
    }
  }
}

export const authService = AuthService.getInstance();
