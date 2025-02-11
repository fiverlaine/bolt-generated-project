import { User, Session } from '@supabase/supabase-js';

export interface AuthResponse {
  success: boolean;
  data?: {
    user: User | null;
    session: Session | null;
  };
  error?: string;
}

export interface AuthStrategy {
  authenticate(identifier: string): Promise<AuthResponse>;
}
