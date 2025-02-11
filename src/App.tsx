import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { LoginForm } from './components/auth/LoginForm';
import { TradingControls } from './components/trading/TradingControls';
import { MarketAnalyzer } from './components/MarketAnalyzer';
import { SignalAnalyzer } from './components/SignalAnalyzer';
import { SignalHistory } from './components/SignalHistory';
import { Analytics } from './components/Analytics';
import { TradingView } from './components/TradingView';
import { Learn } from './components/Learn';
import { playAlert } from './utils/sound';
import { SignalUpdate } from './types/trading';
import { useSignalResults } from './hooks/useSignalResults';
import { useTradeStore } from './hooks/useTradeStore';
import { useAuth } from './hooks/useAuth';
import { Loader2 } from 'lucide-react';

export default function App() {
  const { session, loading: authLoading, initialized } = useAuth();
  const { 
    currentView, 
    selectedPair, 
    timeframe,
    signals, 
    addSignal, 
    updateSignal, 
    loadPendingSignals,
    initializeSignals,
    setView,
    setPair,
    setTimeframe
  } = useTradeStore();
  const { checkSignalResult } = useSignalResults();
  const [appReady, setAppReady] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const [lastSignal, setLastSignal] = useState<SignalUpdate | null>(null);

  // Inicialização do app após autenticação
  useEffect(() => {
    let mounted = true;

    const initializeApp = async () => {
      if (session) {
        try {
          setInitError(null);
          await initializeSignals();
          await loadPendingSignals();
          if (mounted) {
            setAppReady(true);
          }
        } catch (error) {
          console.error('Error loading initial data:', error);
          if (mounted) {
            setInitError('Erro ao carregar dados iniciais. Tente recarregar a página.');
            setAppReady(true);
          }
        }
      }
    };

    if (initialized && session) {
      setAppReady(false);
      initializeApp();
    } else if (initialized && !session) {
      setAppReady(true);
    }

    return () => {
      mounted = false;
    };
  }, [session, initialized, loadPendingSignals, initializeSignals]);

  const handleSignalGenerated = useCallback((signal: SignalUpdate | null) => {
    if (signal && (signal.type === 'buy' || signal.type === 'sell')) {
      playAlert(signal.type);
      
      const newSignal = {
        id: signal.id || crypto.randomUUID(),
        type: signal.type,
        price: signal.price,
        time: signal.time,
        pair: selectedPair,
        confidence: Math.round(70 + Math.random() * 20),
        martingaleStep: signal.martingaleStep || 0,
        martingaleMultiplier: signal.martingaleMultiplier || 1,
        timeframe
      };
      
      addSignal(newSignal);
      setLastSignal(signal);
      
      checkSignalResult(newSignal, timeframe, updateSignal);
    }
  }, [selectedPair, timeframe, addSignal, updateSignal, checkSignalResult]);

  const successRate = signals.filter(s => s.result === 'win').length / signals.filter(s => s.result).length * 100 || 0;

  // Memoize content components to prevent unnecessary re-renders
  const signalsContent = useMemo(() => (
    <>
      <TradingControls
        selectedPair={selectedPair}
        timeframe={timeframe}
        onPairChange={setPair}
        onTimeframeChange={setTimeframe}
      />

      <SignalAnalyzer 
        selectedPair={selectedPair}
        timeframe={timeframe}
        onSignalGenerated={handleSignalGenerated}
      />
      
      <MarketAnalyzer 
        selectedPair={selectedPair}
        timeframe={timeframe}
        lastSignal={lastSignal}
      />

      <SignalHistory 
        signals={signals}
        successRate={successRate}
      />
    </>
  ), [selectedPair, timeframe, handleSignalGenerated, lastSignal, signals, successRate, setPair, setTimeframe]);

  const tradingContent = useMemo(() => (
    <TradingView
      selectedPair={selectedPair}
      timeframe={timeframe}
      onPairChange={setPair}
      onTimeframeChange={setTimeframe}
    />
  ), [selectedPair, timeframe, setPair, setTimeframe]);

  // Loading states
  if (!initialized || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <Loader2 className="animate-spin text-green-500 mx-auto mb-4" size={32} />
          <p className="text-gray-400">Iniciando...</p>
        </div>
      </div>
    );
  }

  if (session && !appReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <Loader2 className="animate-spin text-green-500 mx-auto mb-4" size={32} />
          <p className="text-gray-400">Carregando dados...</p>
        </div>
      </div>
    );
  }

  // Login screen
  if (!session) {
    return <LoginForm />;
  }

  // Main app
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header currentView={currentView} onViewChange={setView} />

      <main className="flex-1 overflow-hidden pb-20 sm:pb-0">
        <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
          {initError ? (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-500">
              <p>{initError}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {currentView === 'signals' && signalsContent}
              {currentView === 'trading' && tradingContent}
              {currentView === 'analytics' && <Analytics />}
              {currentView === 'learn' && <Learn />}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
