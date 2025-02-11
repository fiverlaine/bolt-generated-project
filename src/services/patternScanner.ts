import { CandlePattern } from '../types/trading';

export class PatternScanner {
  static detectDojiPattern(candles: any[]): boolean {
    const lastCandle = candles[candles.length - 1];
    const bodySize = Math.abs(lastCandle.open - lastCandle.close);
    const totalSize = lastCandle.high - lastCandle.low;
    return bodySize / totalSize < 0.1;
  }

  static detectEngulfingPattern(candles: any[]): boolean {
    if (candles.length < 2) return false;
    
    const current = candles[candles.length - 1];
    const previous = candles[candles.length - 2];
    
    const currentBody = Math.abs(current.close - current.open);
    const previousBody = Math.abs(previous.close - previous.open);
    
    const isBullish = current.close > current.open && previous.close < previous.open;
    const isBearish = current.close < current.open && previous.close > previous.open;
    
    return (isBullish || isBearish) && currentBody > previousBody;
  }

  static detectHammerPattern(candles: any[]): boolean {
    const lastCandle = candles[candles.length - 1];
    const body = Math.abs(lastCandle.open - lastCandle.close);
    const upperWick = lastCandle.high - Math.max(lastCandle.open, lastCandle.close);
    const lowerWick = Math.min(lastCandle.open, lastCandle.close) - lastCandle.low;
    
    return lowerWick > (body * 2) && upperWick < (body * 0.5);
  }

  static detectAllPatterns(candles: any[]): CandlePattern[] {
    const patterns: CandlePattern[] = [];
    
    if (this.detectDojiPattern(candles)) {
      patterns.push({
        type: 'doji',
        strength: 'medium',
        description: 'Padrão Doji detectado - indica indecisão no mercado'
      });
    }
    
    if (this.detectEngulfingPattern(candles)) {
      patterns.push({
        type: 'engulfing',
        strength: 'strong',
        description: 'Padrão Engolfo detectado - possível reversão'
      });
    }
    
    if (this.detectHammerPattern(candles)) {
      patterns.push({
        type: 'hammer',
        strength: 'strong',
        description: 'Padrão Martelo detectado - possível fundo'
      });
    }
    
    return patterns;
  }
}
