import { useState, useEffect } from 'react';
import { CandlePattern } from '../types/trading';
import { PatternScanner } from '../services/patternScanner';

export const usePatternScanner = (candles: any[]) => {
  const [patterns, setPatterns] = useState<CandlePattern[]>([]);

  useEffect(() => {
    if (candles.length > 0) {
      const detectedPatterns = PatternScanner.detectAllPatterns(candles);
      setPatterns(detectedPatterns);
    }
  }, [candles]);

  return { patterns };
};
