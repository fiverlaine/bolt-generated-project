import { Signal } from './trading';

export interface TradeState {
  isAutomated: boolean;
  signals: Signal[];
  setAutomated: (value: boolean) => void;
  addSignal: (signal: Signal) => void;
  updateSignal: (signal: Signal) => void;
  clearSignals: () => void;
}
