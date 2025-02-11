import { supabase } from './supabase';
import { Signal } from '../types/trading';
import { retry } from '../utils/retryUtils';

export const signalService = {
  async createSignal(signal: Omit<Signal, 'id' | 'result' | 'profitLoss'>) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Validate signal data before sending to database
      if (!signal.type || !signal.price || !signal.pair || !signal.timeframe || !signal.time) {
        throw new Error('Invalid signal data');
      }

      const signalData = {
        id: signal.id, // Use client-generated ID
        type: signal.type,
        price: signal.price,
        pair: signal.pair,
        confidence: signal.confidence,
        timeframe: signal.timeframe,
        user_id: user.id,
        martingale_step: signal.martingaleStep || 0,
        martingale_multiplier: signal.martingaleMultiplier || 1.0,
        time: signal.time,
        processing_status: 'pending',
        created_at: new Date().toISOString()
      };

      // Retry the operation up to 3 times with exponential backoff
      return await retry(async () => {
        // Check if signal already exists
        const { data: existingSignal, error: existingError } = await supabase
          .from('signals')
          .select()
          .eq('id', signal.id)
          .maybeSingle();

        if (existingError) {
          console.error('Error checking existing signal:', existingError);
          return null;
        }

        if (existingSignal) {
          console.warn('Signal already exists:', signal.id);
          return signal;
        }

        const { data, error } = await supabase
          .from('signals')
          .insert([signalData])
          .select()
          .maybeSingle();

        if (error) {
          console.error('Database error:', error);
          throw error; // This will trigger retry
        }
        
        if (!data) {
          throw new Error('No data returned from signal creation');
        }
        
        return {
          ...signal,
          id: data.id,
          time: data.time,
          martingaleStep: data.martingale_step,
          martingaleMultiplier: data.martingale_multiplier
        };
      }, 3, 1000);
    } catch (error) {
      console.error('Error creating signal:', error);
      return null;
    }
  },

  async getPendingSignals(): Promise<Signal[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return [];
      }

      const { data, error } = await supabase
        .from('signals')
        .select('*')
        .eq('user_id', user.id)
        .eq('processing_status', 'pending')
        .is('result', null)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading pending signals:', error);
        return [];
      }

      return (data || []).map(signal => ({
        id: signal.id,
        type: signal.type as 'buy' | 'sell',
        price: signal.price,
        pair: signal.pair,
        confidence: signal.confidence,
        result: signal.result as 'win' | 'loss' | undefined,
        profitLoss: signal.profit_loss,
        time: signal.time,
        timeframe: signal.timeframe,
        martingaleStep: signal.martingale_step,
        martingaleMultiplier: signal.martingale_multiplier
      }));
    } catch (error) {
      console.error('Error loading pending signals:', error);
      return [];
    }
  },

  async getAllSignals(): Promise<Signal[] | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.warn('User not authenticated when fetching all signals');
        return null;
      }

      const { data, error } = await supabase
        .from('signals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching all signals:', error);
        return null;
      }

      return data.map(signal => ({
        id: signal.id,
        type: signal.type as 'buy' | 'sell',
        price: Number(signal.price),
        pair: signal.pair,
        confidence: Number(signal.confidence),
        result: signal.result as 'win' | 'loss' | undefined,
        profitLoss: signal.profit_loss,
        time: signal.time,
        timeframe: signal.timeframe,
        martingaleStep: signal.martingale_step,
        martingaleMultiplier: signal.martingale_multiplier
      }));
    } catch (error) {
      console.error('Error fetching all signals:', error);
      return null;
    }
  },

  async getSignalById(signalId: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('signals')
        .select('*')
        .eq('id', signalId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching signal:', error);
        return null;
      }

      if (data) {
        return {
          id: data.id,
          type: data.type as 'buy' | 'sell',
          price: data.price,
          pair: data.pair,
          confidence: data.confidence,
          result: data.result as 'win' | 'loss' | undefined,
          profitLoss: data.profit_loss,
          time: data.time,
          timeframe: data.timeframe,
          martingaleStep: data.martingale_step,
          martingaleMultiplier: data.martingale_multiplier
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching signal:', error);
      return null;
    }
  },

  async updateSignalResult(
    signalId: string,
    result?: 'win' | 'loss',
    profitLoss?: number
  ) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      if (!signalId) {
        throw new Error('Invalid signal ID');
      }

      // Verify signal exists and hasn't been processed
      const { data: existingSignal, error: existingError } = await supabase
        .from('signals')
        .select('*')
        .eq('id', signalId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingError) {
        console.error('Error checking signal:', existingError);
        return null;
      }

      if (!existingSignal) {
        console.error('Signal not found:', signalId);
        return null;
      }

      if (existingSignal.result) {
        console.warn('Signal already has result:', signalId);
        return existingSignal;
      }

      const updateData: Record<string, any> = {
        updated_at: new Date().toISOString(),
        processing_status: 'completed'
      };

      if (result) updateData.result = result;
      if (typeof profitLoss !== 'undefined') updateData.profit_loss = profitLoss;

      const { data: updatedSignal, error: updateError } = await supabase
        .from('signals')
        .update(updateData)
        .eq('id', signalId)
        .eq('user_id', user.id)
        .select()
        .maybeSingle();

      if (updateError) {
        console.error('Error updating signal:', updateError);
        return null;
      }

      return updatedSignal;
    } catch (error) {
      console.error('Error updating signal:', error);
      return null;
    }
  },

  async clearSignalHistory() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return;
      }

      const { error } = await supabase
        .from('signals')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error clearing signal history:', error);
      }
    } catch (error) {
      console.error('Error clearing signal history:', error);
    }
  }
};
