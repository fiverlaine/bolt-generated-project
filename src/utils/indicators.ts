import { RSI, EMA, MACD } from 'technicalindicators';

const safeCalculation = <T>(calculation: () => T, defaultValue: T): T => {
  try {
    return calculation();
  } catch (error) {
    console.error('Calculation error:', error);
    return defaultValue;
  }
};

// Calcula Pivot Points
const calculatePivotPoints = (high: number, low: number, close: number) => {
  if (isNaN(high) || isNaN(low) || isNaN(close)) {
    throw new Error('Valores inválidos para cálculo de Pivot Points');
  }
  
  const pivot = (high + low + close) / 3;
  const r1 = 2 * pivot - low;
  const r2 = pivot + (high - low);
  const s1 = 2 * pivot - high;
  const s2 = pivot - (high - low);
  
  return { pivot, r1, r2, s1, s2 };
};

// Encontra níveis de suporte e resistência
const findSupportResistanceLevels = (data: any[], lookback: number = 20) => {
  if (!data || data.length < lookback) {
    throw new Error('Dados insuficientes para análise de suporte/resistência');
  }

  const levels: { price: number; strength: number; type: 'support' | 'resistance' }[] = [];
  const priceRanges = new Map<string, number>();

  for (let i = data.length - lookback; i < data.length; i++) {
    if (!data[i] || isNaN(data[i].high) || isNaN(data[i].low)) {
      throw new Error('Dados inválidos para análise de suporte/resistência');
    }

    const high = Math.round(data[i].high * 100) / 100;
    const low = Math.round(data[i].low * 100) / 100;

    [high, low].forEach(price => {
      const key = price.toString();
      priceRanges.set(key, (priceRanges.get(key) || 0) + 1);
    });
  }

  priceRanges.forEach((count, priceStr) => {
    const price = parseFloat(priceStr);
    if (count >= 3) {
      const recentPrice = data[data.length - 1].close;
      const type = price > recentPrice ? 'resistance' : 'support';
      levels.push({
        price,
        strength: count,
        type
      });
    }
  });

  return levels.sort((a, b) => b.strength - a.strength).slice(0, 5);
};

export const calculateRSI = (prices: number[], period: number = 14) => {
  if (!prices || prices.length < period) {
    throw new Error('Dados insuficientes para cálculo do RSI');
  }

  return safeCalculation(
    () => RSI.calculate({ values: prices, period }),
    Array(prices.length).fill(50)
  );
};

export const calculateEMA = (prices: number[], period: number) => {
  if (!prices || prices.length < period) {
    throw new Error('Dados insuficientes para cálculo da EMA');
  }

  return safeCalculation(
    () => EMA.calculate({ values: prices, period }),
    Array(prices.length).fill(prices[prices.length - 1])
  );
};

export const calculateMACD = (prices: number[]) => {
  if (!prices || prices.length < 26) {
    throw new Error('Dados insuficientes para cálculo do MACD');
  }

  return safeCalculation(
    () => MACD.calculate({
      values: prices,
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
      SimpleMAOscillator: false,
      SimpleMASignal: false
    }),
    Array(prices.length).fill({ MACD: 0, signal: 0, histogram: 0 })
  );
};

export const analyzeMarket = (data: any[]) => {
  if (!data || !Array.isArray(data)) {
    throw new Error('Dados inválidos para análise');
  }

  if (data.length < 30) {
    throw new Error('Dados insuficientes para análise (mínimo 30 períodos)');
  }

  try {
    // Validar e extrair preços
    const prices = data.map((candle, index) => {
      const close = Number(candle.close);
      if (isNaN(close) || close <= 0) {
        throw new Error(`Preço de fechamento inválido detectado no candle ${index + 1}`);
      }
      return close;
    });

    const highs = data.map((candle, index) => {
      const high = Number(candle.high);
      if (isNaN(high) || high <= 0) {
        throw new Error(`Preço máximo inválido detectado no candle ${index + 1}`);
      }
      return high;
    });

    const lows = data.map((candle, index) => {
      const low = Number(candle.low);
      if (isNaN(low) || low <= 0) {
        throw new Error(`Preço mínimo inválido detectado no candle ${index + 1}`);
      }
      return low;
    });

    const lastCandle = data[data.length - 1];
    if (!lastCandle) {
      throw new Error('Último candle não encontrado');
    }

    const pivotPoints = calculatePivotPoints(
      lastCandle.high,
      lastCandle.low,
      lastCandle.close
    );
    
    const supportResistanceLevels = findSupportResistanceLevels(data);

    const rsi = calculateRSI(prices);
    const ema20 = calculateEMA(prices, 20);
    const ema50 = calculateEMA(prices, 50);
    const macd = calculateMACD(prices);

    const lastPrice = prices[prices.length - 1];
    const lastRSI = rsi[rsi.length - 1];
    const lastEMA20 = ema20[ema20.length - 1];
    const lastEMA50 = ema50[ema50.length - 1];
    const lastMACD = macd[macd.length - 1];

    if (isNaN(lastPrice) || isNaN(lastRSI) || isNaN(lastEMA20) || isNaN(lastEMA50)) {
      throw new Error('Valores inválidos nos indicadores');
    }

    const signals: string[] = [];
    let direction: 'up' | 'down' | 'neutral' = 'neutral';
    let confidence = 50;

    // Análise de Suporte e Resistência
    const nearestSupport = supportResistanceLevels
      .filter(level => level.type === 'support' && level.price < lastPrice)
      .sort((a, b) => b.price - a.price)[0];

    const nearestResistance = supportResistanceLevels
      .filter(level => level.type === 'resistance' && level.price > lastPrice)
      .sort((a, b) => a.price - b.price)[0];

    if (nearestSupport) {
      const distanceToSupport = ((lastPrice - nearestSupport.price) / lastPrice) * 100;
      if (distanceToSupport < 0.5) {
        signals.push(`Próximo ao suporte (${nearestSupport.price.toFixed(2)})`);
        confidence += 15;
        direction = 'up';
      }
    }

    if (nearestResistance) {
      const distanceToResistance = ((nearestResistance.price - lastPrice) / lastPrice) * 100;
      if (distanceToResistance < 0.5) {
        signals.push(`Próximo à resistência (${nearestResistance.price.toFixed(2)})`);
        confidence += 15;
        direction = 'down';
      }
    }

    // RSI Analysis
    if (lastRSI < 30) {
      signals.push('RSI indica sobrevendido');
      confidence += 20;
      direction = 'up';
    } else if (lastRSI > 70) {
      signals.push('RSI indica sobrecomprado');
      confidence += 20;
      direction = 'down';
    }

    // MACD Analysis
    if (lastMACD.MACD > lastMACD.signal && lastMACD.histogram > 0) {
      signals.push('MACD indica momentum positivo');
      confidence += direction === 'up' ? 20 : 10;
      direction = 'up';
    } else if (lastMACD.MACD < lastMACD.signal && lastMACD.histogram < 0) {
      signals.push('MACD indica momentum negativo');
      confidence += direction === 'down' ? 20 : 10;
      direction = 'down';
    }

    // EMA Analysis
    if (lastPrice > lastEMA20 && lastEMA20 > lastEMA50) {
      signals.push('Tendência de alta (EMA20 > EMA50)');
      confidence += direction === 'up' ? 20 : 10;
      direction = 'up';
    } else if (lastPrice < lastEMA20 && lastEMA20 < lastEMA50) {
      signals.push('Tendência de baixa (EMA20 < EMA50)');
      confidence += direction === 'down' ? 20 : 10;
      direction = 'down';
    }

    return {
      confidence: Math.min(confidence, 99),
      signals,
      direction,
      indicators: {
        rsiValues: rsi,
        macd: macd,
        ema20,
        ema50
      },
      levels: {
        pivotPoints,
        supportResistance: supportResistanceLevels
      }
    };
  } catch (error) {
    console.error('Analysis error:', error);
    throw error instanceof Error ? error : new Error('Falha na análise técnica');
  }
};
