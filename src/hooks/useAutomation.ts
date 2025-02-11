import { useState, useEffect, useRef, useCallback } from 'react';
import { SignalUpdate } from '../types/trading';
import { fetchMarketData } from '../services/cryptoApi';
import { analyzeMarket } from '../utils/indicators';
import { useTradeStore } from './useTradeStore';
import { useSettings } from './useSettings';
import { useSignalResults } from './useSignalResults';
import { signalService } from '../services/signalService';
import { v4 as uuidv4 } from 'uuid';

const ANALYSIS_INTERVAL = 5000; // 5 segundos
const MAX_RETRIES = 3;
const MIN_CONFIDENCE = 65;

export const useAutomation = (
  selectedPair: string,
  timeframe: number
) => {
  const { isAutomated, currentSignal, setCurrentSignal, addSignal, updateSignal } = useTradeStore();
  const { settings } = useSettings();
  const { checkSignalResult } = useSignalResults();
  
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const automationRef = useRef(isAutomated);
  const analysisInterval = useRef<NodeJS.Timeout>();
  const operationInProgress = useRef(false);
  const lastAnalysisTime = useRef<number>(0);
  const signalCheckTimeout = useRef<NodeJS.Timeout>();
  const retryCount = useRef(0);
  const mounted = useRef(true);
  const analyzeRef = useRef<() => Promise<void>>();
  const selectedPairRef = useRef(selectedPair);

  const resetState = useCallback(() => {
    if (!mounted.current) return;
    
    operationInProgress.current = false;
    setCurrentSignal(null);
    setError(null);
    lastAnalysisTime.current = 0;
    
    if (signalCheckTimeout.current) {
      clearTimeout(signalCheckTimeout.current);
      signalCheckTimeout.current = undefined;
    }
  }, [setCurrentSignal]);

  const handleSignalResult = useCallback(async (updatedSignal: SignalUpdate) => {
    if (!mounted.current || !updatedSignal.time || !updatedSignal.id) return;

    try {
      // Atualiza o sinal no store
      updateSignal(updatedSignal);
      
      const isLastGale = (updatedSignal.martingaleStep || 0) === 2;
      const isMartingaleDisabled = !settings?.martingaleEnabled;
      const isWin = updatedSignal.result === 'win';
      
      // Se o sinal foi completado, reseta o estado
      if (isWin || isLastGale || (updatedSignal.result === 'loss' && isMartingaleDisabled)) {
        // Atualiza o status no banco de dados
        await signalService.updateSignalResult(
          updatedSignal.id,
          updatedSignal.result,
          updatedSignal.profitLoss
        );
        
        // Reseta o estado e força uma nova análise
        resetState();
        
        // Força uma nova análise após um breve delay
        setTimeout(() => {
          if (mounted.current && automationRef.current && analyzeRef.current) {
            lastAnalysisTime.current = 0;
            analyzeRef.current();
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Error handling signal result:', error);
      resetState();
    }
  }, [settings, resetState, updateSignal]);

  const analyze = useCallback(async () => {
    if (!mounted.current || !isAutomated) return;

    const now = Date.now();
    const minInterval = selectedPairRef.current !== selectedPair ? 0 : ANALYSIS_INTERVAL;
    
    if (now - lastAnalysisTime.current < minInterval) {
      return;
    }

    // Atualiza a referência do par atual
    selectedPairRef.current = selectedPair;

    // Verifica se há uma operação em andamento
    if (currentSignal || operationInProgress.current) {
      setAnalyzing(false);
      return;
    }
    
    // Verifica outras condições
    if (!settings) {
      setAnalyzing(false);
      return;
    }

    try {
      setAnalyzing(true);
      setError(null);
      operationInProgress.current = true;
      
      const marketData = await fetchMarketData(selectedPair, timeframe);
      const analysis = analyzeMarket(marketData);

      if (analysis.confidence >= MIN_CONFIDENCE) {
        const signalId = uuidv4();
        const signal: SignalUpdate = {
          id: signalId,
          type: analysis.direction === 'up' ? 'buy' : 'sell',
          price: marketData[marketData.length - 1].close,
          time: new Date().toLocaleTimeString(),
          pair: selectedPair,
          confidence: analysis.confidence,
          martingaleStep: 0,
          timeframe
        };

        lastAnalysisTime.current = now;

        const createdSignal = await signalService.createSignal(signal);
        
        if (createdSignal) {
          retryCount.current = 0;
          setCurrentSignal(signal);
          addSignal(signal);

          if (signalCheckTimeout.current) {
            clearTimeout(signalCheckTimeout.current);
          }

          // Configura o timeout para verificar o resultado
          const checkTime = timeframe * 60 * 1000;
          signalCheckTimeout.current = setTimeout(() => {
            checkSignalResult(signal, timeframe, handleSignalResult);
          }, checkTime);

          // Backup timeout para garantir que o sinal será finalizado
          setTimeout(() => {
            if (mounted.current && currentSignal?.id === signal.id) {
              handleSignalResult({
                ...signal,
                result: 'loss',
                profitLoss: 0
              });
            }
          }, checkTime + 5000); // 5 segundos extras para garantir
        } else {
          throw new Error('Failed to create signal');
        }
      }
    } catch (error) {
      console.error('Analysis error:', error);
      setError('Erro na análise. Tentando novamente...');
      
      retryCount.current++;
      if (retryCount.current <= MAX_RETRIES) {
        setTimeout(() => {
          if (mounted.current && analyzeRef.current) {
            analyzeRef.current();
          }
        }, retryCount.current * 1000);
      } else {
        resetState();
      }
    } finally {
      operationInProgress.current = false;
      if (mounted.current) setAnalyzing(false);
    }
  }, [
    selectedPair, 
    timeframe, 
    settings, 
    checkSignalResult,
    handleSignalResult,
    currentSignal,
    setCurrentSignal,
    addSignal,
    resetState,
    isAutomated
  ]);

  // Atualiza a referência da função analyze
  useEffect(() => {
    analyzeRef.current = analyze;
  }, [analyze]);

  // Effect para iniciar/parar a automação
  useEffect(() => {
    automationRef.current = isAutomated;
    
    const startAnalysis = () => {
      if (isAutomated && !analysisInterval.current && analyzeRef.current) {
        // Força análise imediata ao iniciar
        lastAnalysisTime.current = 0;
        analyzeRef.current();
        
        analysisInterval.current = setInterval(() => {
          if (analyzeRef.current) {
            analyzeRef.current();
          }
        }, ANALYSIS_INTERVAL);
      }
    };

    const stopAnalysis = () => {
      if (analysisInterval.current) {
        clearInterval(analysisInterval.current);
        analysisInterval.current = undefined;
      }
    };

    if (isAutomated) {
      startAnalysis();
    } else {
      stopAnalysis();
      resetState();
    }

    return () => {
      stopAnalysis();
    };
  }, [isAutomated, resetState]);

  // Effect para forçar análise quando o par mudar
  useEffect(() => {
    if (isAutomated && analyzeRef.current) {
      lastAnalysisTime.current = 0;
      analyzeRef.current();
    }
  }, [selectedPair, isAutomated]);

  // Cleanup effect
  useEffect(() => {
    mounted.current = true;
    
    return () => {
      mounted.current = false;
      if (analysisInterval.current) {
        clearInterval(analysisInterval.current);
      }
      if (signalCheckTimeout.current) {
        clearTimeout(signalCheckTimeout.current);
      }
    };
  }, []);

  return {
    analyzing,
    error,
    toggleAutomation: useCallback(() => {
      if (!settings && !isAutomated) {
        return false;
      }
      return true;
    }, [settings, isAutomated])
  };
};
