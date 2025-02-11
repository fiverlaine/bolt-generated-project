import { format } from 'date-fns';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

class CacheService {
  private cache: Map<string, CacheItem<any>> = new Map();
  private readonly DEFAULT_EXPIRY = 5000; // 5 segundos

  private createKey(pair: string, timeframe: number): string {
    const date = format(new Date(), 'yyyy-MM-dd-HH-mm');
    return `${pair}-${timeframe}-${date}`;
  }

  set<T>(pair: string, timeframe: number, data: T, expiry: number = this.DEFAULT_EXPIRY): void {
    const key = this.createKey(pair, timeframe);
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiry
    });
  }

  get<T>(pair: string, timeframe: number): T | null {
    const key = this.createKey(pair, timeframe);
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    if (Date.now() - item.timestamp > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data as T;
  }

  clear(): void {
    this.cache.clear();
  }
}

export const marketDataCache = new CacheService();
