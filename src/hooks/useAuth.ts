import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';
import { authService } from '../services/auth/authService';

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let refreshTimer: NodeJS.Timeout;

    const initAuth = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get initial session
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (mounted) {
          setSession(initialSession);
          setInitialized(true);
        }

        // Set up session refresh
        if (initialSession) {
          const refreshSession = async () => {
            try {
              await authService.refreshSession();
            } catch (error) {
              console.error('Session refresh error:', error);
            }
          };

          // Refresh session every 30 minutes
          refreshTimer = setInterval(refreshSession, 30 * 60 * 1000);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setError('Erro ao inicializar autenticação');
          setSession(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    // Initialize auth
    initAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setSession(session);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
      if (refreshTimer) {
        clearInterval(refreshTimer);
      }
    };
  }, []);

  const signIn = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.signIn(email);
      
      if (response.success && response.data?.session) {
        setSession(response.data.session);
      } else {
        setError(response.error || 'Erro ao fazer login');
      }
      
      return response;
    } catch (error) {
      setError('Erro ao fazer login. Tente novamente.');
      return { 
        success: false, 
        error: 'Erro ao fazer login. Tente novamente.' 
      };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      await authService.signOut();
      setSession(null);
      return { success: true };
    } catch (error) {
      setError('Erro ao fazer logout');
      return { 
        success: false, 
        error: 'Erro ao fazer logout' 
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    session,
    loading,
    initialized,
    error,
    signIn,
    signOut,
    isAuthenticated: !!session
  };
};
