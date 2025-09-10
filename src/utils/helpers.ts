import { API_CONFIG } from './constants';

export const calculateDelay = (
  attempt: number,
  baseDelay: number = API_CONFIG.RETRY_DELAY
): number => {
  return Math.min(baseDelay * Math.pow(2, attempt), 10000); // Cap at 10 seconds
};

export const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));
