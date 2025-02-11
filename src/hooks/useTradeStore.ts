import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Signal, View } from '../types/trading';
import { signalService } from '../services/signalService';

interface TradeState {
  isAutomated: boolean;
  signals: Signal[];
  currentSignal: Signal | null;
  currentView: View;
  selectedPair: string;
  timeframe: number;
  setAutomated: (value: boolean) => void;
  setCurrentSignal: (signal: Signal | null) => void;
  setView: (view: View) => void;
  setPair: (pair: string) => void;
  setTimeframe: (timeframe: number) => void;
  addSignal: (signal: Signal) => void;
  updateSignal: (signal: Signal) => void;
  clearSignals: () => void;
  loadPendingSignals: () => Promise<void>;
  initializeSignals: () => Promise<void>;
}

const initialState: Omit<TradeState, 'setAutomated' | 'setCurrentSignal' | 'setView' | 'setPair' | 'setTimeframe' | 'addSignal' | 'updateSignal' | 'clearSignals' | 'loadPendingSignals' | 'initializeSignals'> = {
  isAutomated: false,
  signals: [],
  currentSignal: null,
  currentView: 'signals',
  selectedPair: 'BTC/USD',
  timeframe: 1
};

export const useTradeStore = create<TradeState>()(
  persist(
    (set, get) => ({
      ...initialState,
      setAutomated: (value) => {
        const { currentSignal } = get();
        if (!value || !currentSignal) {
          set({ isAutomated: value });
        }
      },
      setCurrentSignal: (signal) => {
        if (!signal) {
          set({ currentSignal: null });
          return;
        }

        const existingSignal = get().signals.find(s => s.id === signal.id);
        if (existingSignal?.result) {
          set({ currentSignal: null });
          return;
        }

        set({ currentSignal: signal });
      },
      setView: (view) => set({ currentView: view }),
      setPair: (pair) => {
        const { currentSignal } = get();
        if (!currentSignal) {
          set({ selectedPair: pair });
        }
      },
      setTimeframe: (timeframe) => {
        const { currentSignal } = get();
        if (!currentSignal) {
          set({ timeframe });
        }
      },
      addSignal: (signal) => {
        const { signals } = get();
        if (!signals.some(s => s.id === signal.id)) {
          set((state) => ({ 
            signals: [signal, ...state.signals],
            currentSignal: signal
          }));
        }
      },
      updateSignal: (signal) => {
        if (!signal.id) return;

        set((state) => {
          const updatedSignals = state.signals.map(s => 
            s.id === signal.id ? signal : s
          );
          
          const updatedCurrentSignal = state.currentSignal?.id === signal.id
            ? (signal.result ? null : signal)
            : state.currentSignal;

          return {
            signals: updatedSignals,
            currentSignal: updatedCurrentSignal
          };
        });
      },
      clearSignals: () => set({ signals: [], currentSignal: null }),
      loadPendingSignals: async () => {
        try {
          const pendingSignals = await signalService.getPendingSignals();
          const state = get();
          
          const newSignals = pendingSignals.filter(
            pending => !state.signals.some(current => current.id === pending.id)
          );
          
          if (newSignals.length > 0) {
            const lastPendingSignal = newSignals.find(signal => !signal.result);
            
            set((state) => ({
              signals: [...newSignals, ...state.signals],
              currentSignal: lastPendingSignal || state.currentSignal
            }));
          }
        } catch (error) {
          console.error('Error loading pending signals:', error);
        }
      },
      initializeSignals: async () => {
        try {
          // Busca todos os sinais do usuário
          const allSignals = await signalService.getAllSignals();
          
          if (!allSignals) {
            console.warn('No signals found during initialization');
            return;
          }

          // Encontra o último sinal pendente
          const lastPendingSignal = allSignals.find(signal => !signal.result);

          // Atualiza o estado
          set({
            signals: allSignals,
            currentSignal: lastPendingSignal || null
          });
        } catch (error) {
          console.error('Error initializing signals:', error);
        }
      }
    }),
    {
      name: 'trade-store',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          return initialState;
        }
        return persistedState as TradeState;
      }
    }
  )
);
