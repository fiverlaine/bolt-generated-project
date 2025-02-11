import { RATE_LIMIT } from './constants';

class RateLimiter {
  private attempts: Map<string, number> = new Map();
  private lastAttempt: Map<string, number> = new Map();

  canAttempt(identifier: string): boolean {
    const now = Date.now();
    const lastAttemptTime = this.lastAttempt.get(identifier) || 0;
    const attempts = this.attempts.get(identifier) || 0;

    if (now - lastAttemptTime >= RATE_LIMIT.COOLDOWN_MS) {
      this.reset(identifier);
      return true;
    }

    return attempts < RATE_LIMIT.MAX_ATTEMPTS;
  }

  recordAttempt(identifier: string): void {
    const attempts = (this.attempts.get(identifier) || 0) + 1;
    this.attempts.set(identifier, attempts);
    this.lastAttempt.set(identifier, Date.now());
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier);
    this.lastAttempt.delete(identifier);
  }

  getRemainingCooldown(identifier: string): number {
    const lastAttemptTime = this.lastAttempt.get(identifier) || 0;
    const remaining = RATE_LIMIT.COOLDOWN_MS - (Date.now() - lastAttemptTime);
    return Math.max(0, remaining);
  }
}

export const rateLimiter = new RateLimiter();
