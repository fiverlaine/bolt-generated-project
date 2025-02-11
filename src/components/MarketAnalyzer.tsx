import React, { useState, useEffect, useCallback } from 'react';
import { AlertTriangle } from 'lucide-react';
import { fetchMarketData } from '../services/cryptoApi';
import { analyzeMarket } from '../utils/indicators';
import { PriceChart } from './charts/PriceChart';
import { RSIChart } from './charts/RSIChart';
import { MACDChart } from './charts/MACDChart';
import { PatternIndicator } from './PatternIndicator';
import { usePatternScanner } from '../hooks/usePatternScanner';
import { SignalUpdate } from '../types/trading';
import { Card } from './ui/Card';

interface Props {
  selectedPair: string;
  timeframe: number;
  lastSignal?: SignalUpdate | null;
}

export const MarketAnalyzer: React.FC<Props> = ({ selectedPair, timeframe, lastSignal }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [chartData, setChartData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { patterns } = usePatternScanner(chartData?.marketData || []);

  const formatChartData = useCallback((marketData: any[]) => {
    try {
      const labels = marketData.map(d => new Date(d.time * 1000).toLocaleTimeString());
      const prices = marketData.map(d => d.close);
      const analysis = analyzeMarket(marketData);
      
      return {
        marketData,
        labels,
        prices,
        rsi: analysis.indicators.rsiValues,
        ema20: analysis.indicators.ema20,
        ema50: analysis.indicators.ema50,
        macd: analysis.indicators.macd,
        supportResistance: analysis.levels.supportResistance,
        pivotPoints: analysis.levels.pivotPoints,
        tendency: analysis.direction === 'up' ? 'Alta' : analysis.direction === 'down' ? 'Baixa' : 'Lateral',
        period: `${timeframe}min`
      };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Erro ao formatar dados';
      console.error('Error formatting chart data:', error);
      throw new Error(error);
    }
  }, [timeframe]);

  const analyzeMarketData = useCallback(async () => {
    if (analyzing) return;
    
    setAnalyzing(true);
    setError(null);
    
    try {
      const marketData = await fetchMarketData(selectedPair, timeframe);
      const formattedData = formatChartData(marketData);
      setChartData(formattedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao analisar mercado';
      setError(errorMessage);
      console.error('Market analysis error:', errorMessage);
    } finally {
      setAnalyzing(false);
    }
  }, [selectedPair, timeframe, analyzing, formatChartData]);

  useEffect(() => {
    analyzeMarketData();
    const interval = setInterval(analyzeMarketData, 5000);
    return () => clearInterval(interval);
  }, [selectedPair, timeframe, lastSignal, analyzeMarketData]);

  if (!chartData) return null;

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl">
          <div className="flex items-center">
            <AlertTriangle size={20} className="mr-2" />
            <p>{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-3 sm:col-span-1">
          <h3 className="text-gray-400 text-sm mb-1">RSI</h3>
          <p className="text-xl font-bold text-green-500">
            {chartData.rsi[chartData.rsi.length - 1]?.toFixed(2) || '--'}%
          </p>
        </Card>
        <Card className="col-span-3 sm:col-span-1">
          <h3 className="text-gray-400 text-sm mb-1">Tendência</h3>
          <p className="text-xl font-bold text-green-500">{chartData.tendency}</p>
        </Card>
        <Card className="col-span-3 sm:col-span-1">
          <h3 className="text-gray-400 text-sm mb-1">Período</h3>
          <p className="text-xl font-bold text-white">{chartData.period}</p>
        </Card>
      </div>

      <div className="grid gap-4">
        <Card className="h-[400px] overflow-hidden">
          <PriceChart 
            data={{
              labels: chartData.labels,
              prices: chartData.prices,
              ema20: chartData.ema20,
              ema50: chartData.ema50,
              supportResistance: chartData.supportResistance,
              pivotPoints: chartData.pivotPoints
            }} 
          />
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="h-[250px] overflow-hidden">
            <RSIChart 
              data={{
                labels: chartData.labels,
                rsi: chartData.rsi
              }} 
            />
          </Card>
          
          <Card className="h-[250px] overflow-hidden">
            <MACDChart 
              data={{
                labels: chartData.labels,
                macd: chartData.macd
              }} 
            />
          </Card>
        </div>

        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Padrões Detectados</h3>
          <PatternIndicator patterns={patterns} />
        </Card>
      </div>

      <div className="text-xs text-gray-400 flex items-center bg-gray-900/50 p-4 rounded-xl border border-gray-800">
        <AlertTriangle size={12} className="mr-2 flex-shrink-0" />
        <span>Resultados baseados em análise técnica. Trade por sua conta e risco.</span>
      </div>
    </div>
  );
};
