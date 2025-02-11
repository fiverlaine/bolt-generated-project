import { Signal, Position } from '../types/trading';

export class PositionManager {
  static calculateStopLoss(signal: Signal, riskPercentage: number = 1): number {
    const stopDistance = (signal.price * riskPercentage) / 100;
    return signal.type === 'buy' 
      ? signal.price - stopDistance 
      : signal.price + stopDistance;
  }

  static calculateTakeProfit(signal: Signal, rewardRatio: number = 2): number {
    const stopDistance = (signal.price * 1) / 100; // 1% stop loss
    const profitDistance = stopDistance * rewardRatio;
    
    return signal.type === 'buy'
      ? signal.price + profitDistance
      : signal.price - profitDistance;
  }

  static createPosition(signal: Signal): Position {
    const stopLoss = this.calculateStopLoss(signal);
    const takeProfit = this.calculateTakeProfit(signal);
    
    return {
      ...signal,
      stopLoss,
      takeProfit,
      status: 'open',
      riskRewardRatio: 2
    };
  }

  static checkPositionStatus(position: Position, currentPrice: number): Position {
    if (position.status !== 'open') return position;

    if (position.type === 'buy') {
      if (currentPrice <= position.stopLoss) {
        return { ...position, status: 'stopped', result: 'loss' };
      }
      if (currentPrice >= position.takeProfit) {
        return { ...position, status: 'closed', result: 'win' };
      }
    } else {
      if (currentPrice >= position.stopLoss) {
        return { ...position, status: 'stopped', result: 'loss' };
      }
      if (currentPrice <= position.takeProfit) {
        return { ...position, status: 'closed', result: 'win' };
      }
    }

    return position;
  }
}
