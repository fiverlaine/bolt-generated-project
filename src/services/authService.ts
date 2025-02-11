import { supabase } from './supabase';

export const authService = {
  async signInWithEmail(email: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: email // Using email as password for simplicity
      });

      if (error?.message.includes('Invalid login credentials')) {
        // If login fails, try to sign up
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password: email,
          options: {
            data: { email }
          }
        });

        if (signUpError) throw signUpError;
        return { success: true, data: signUpData };
      }

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Auth error:', error);
      throw error;
    }
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
};
