/**
 * Setup file for tests
 * Runs before all test suites
 */
import { vi } from 'vitest';

// Suppress console logs during tests (optional)
global.console = {
  ...console,
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
};
