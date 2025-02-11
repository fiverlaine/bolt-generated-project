import { WebSocket } from 'ws';

let ws: WebSocket | null = null;
const subscribers: ((data: any) => void)[] = [];

export const connectWebSocket = (symbol: string) => {
  if (ws) {
    ws.close();
  }

  ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@trade`);

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    subscribers.forEach(callback => callback(data));
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  return () => {
    if (ws) {
      ws.close();
      ws = null;
    }
  };
};

export const subscribeToTrades = (callback: (data: any) => void) => {
  subscribers.push(callback);
  return () => {
    const index = subscribers.indexOf(callback);
    if (index > -1) {
      subscribers.splice(index, 1);
    }
  };
};
