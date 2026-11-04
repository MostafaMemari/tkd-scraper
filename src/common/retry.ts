import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RetryService {
  private readonly logger = new Logger(RetryService.name);

  /**
   * Runs the given async function with exponential backoff.
   * Delay doubles after every failed attempt (delayMs, 2x, 4x, ...).
   */
  async run<T>(fn: () => Promise<T>, retries = 5, delayMs = 3000): Promise<T> {
    let lastError: unknown;

    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        return await fn();
      } catch (err: unknown) {
        lastError = err;
        const delay = delayMs * 2 ** attempt;
        this.logger.warn(
          `Attempt ${attempt + 1}/${retries} failed, retrying in ${delay}ms`,
          err instanceof Error ? err.stack : undefined,
        );
        await new Promise((res) => setTimeout(res, delay));
      }
    }

    throw lastError instanceof Error ? lastError : new Error('Unknown retry error');
  }
}
