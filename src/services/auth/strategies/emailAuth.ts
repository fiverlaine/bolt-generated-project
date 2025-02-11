import { supabase } from '../../supabase';
import { AuthResponse } from '../types';
import { AUTH_ERRORS, AUTH_MESSAGES } from '../constants';
import { rateLimiter } from '../rateLimit';

export const emailAuth = {
  async authenticate(email: string): Promise<AuthResponse> {
    try {
      if (!rateLimiter.canAttempt(email)) {
        const cooldown = Math.ceil(rateLimiter.getRemainingCooldown(email) / 1000);
        return {
          success: false,
          error: `${AUTH_MESSAGES.RATE_LIMIT} (${cooldown}s)`
        };
      }

      rateLimiter.recordAttempt(email);

      // Try sign in first
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: email
      });

      if (!signInError) {
        rateLimiter.reset(email);
        return {
          success: true,
          data: signInData
        };
      }

      // If invalid credentials, try signup
      if (signInError.message === AUTH_ERRORS.INVALID_CREDENTIALS) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password: email,
          options: {
            data: { email }
          }
        });

        // Handle existing user case
        if (signUpError?.message === AUTH_ERRORS.USER_EXISTS) {
          const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
            email,
            password: email
          });

          if (!retryError) {
            rateLimiter.reset(email);
            return {
              success: true,
              data: retryData
            };
          }
        }

        if (!signUpError) {
          rateLimiter.reset(email);
          return {
            success: true,
            data: signUpData
          };
        }
      }

      return {
        success: false,
        error: AUTH_MESSAGES.LOGIN_ERROR
      };
    } catch (error) {
      console.error('Auth error:', error);
      return {
        success: false,
        error: AUTH_MESSAGES.LOGIN_ERROR
      };
    }
  },

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
};
