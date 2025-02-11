import { RSI, MACD, BollingerBands } from 'technicalindicators';

export const calculateRSI = (prices: number[], period: number = 14) => {
  return RSI.calculate({
    values: prices,
    period
  });
};

export const calculateMACD = (prices: number[]) => {
  return MACD.calculate({
    values: prices,
    fastPeriod: 12,
    slowPeriod: 26,
    signalPeriod: 9,
    SimpleMAOscillator: false,
    SimpleMASignal: false
  });
};

export const calculateBollingerBands = (prices: number[]) => {
  return BollingerBands.calculate({
    values: prices,
    period: 20,
    stdDev: 2
  });
};

export const analyzeTrend = (
  rsi: number[],
  macd: any[],
  bb: any[],
  prices: number[]
) => {
  const lastRSI = rsi[rsi.length - 1];
  const lastMACD = macd[macd.length - 1];
  const lastBB = bb[bb.length - 1];
  const lastPrice = prices[prices.length - 1];

  let bullishSignals = 0;
  let bearishSignals = 0;
  const signals = [];

  // RSI Analysis
  if (lastRSI < 30) {
    signals.push('RSI indica sobrevendido (possível reversão de alta)');
    bullishSignals += 2;
  } else if (lastRSI > 70) {
    signals.push('RSI indica sobrecomprado (possível reversão de baixa)');
    bearishSignals += 2;
  }

  // MACD Analysis
  if (lastMACD.histogram > 0 && lastMACD.histogram > macd[macd.length - 2].histogram) {
    signals.push('MACD mostra momentum positivo crescente');
    bullishSignals++;
  } else if (lastMACD.histogram < 0 && lastMACD.histogram < macd[macd.length - 2].histogram) {
    signals.push('MACD mostra momentum negativo crescente');
    bearishSignals++;
  }

  // Bollinger Bands Analysis
  if (lastPrice < lastBB.lower) {
    signals.push('Preço abaixo da Banda de Bollinger inferior (possível sobrevendido)');
    bullishSignals += 2;
  } else if (lastPrice > lastBB.upper) {
    signals.push('Preço acima da Banda de Bollinger superior (possível sobrecomprado)');
    bearishSignals += 2;
  }

  const totalSignals = bullishSignals + bearishSignals;
  const bullishProbability = (bullishSignals / totalSignals) * 100;

  return {
    signals,
    probability: Math.round(bullishProbability),
    direction: bullishProbability > 60 ? 'up' : bullishProbability < 40 ? 'down' : 'neutral',
    strength: Math.min(Math.abs(bullishSignals - bearishSignals) / totalSignals * 100, 100)
  };
};
