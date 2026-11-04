import { Injectable } from '@nestjs/common';

@Injectable()
export class RetryService {
  async run<T>(fn: () => Promise<T>, retries = 5, delayMs = 3000): Promise<T> {
    let lastError: unknown;

    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (err: unknown) {
        lastError = err;
        console.error('Retry error:', err);
        await new Promise((res) => setTimeout(res, delayMs));
      }
    }

    throw lastError instanceof Error ? lastError : new Error('Unknown retry error');
  }
}
