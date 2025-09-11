import Constants from 'expo-constants';
import { SortBy } from '../types';

export const SORT_OPTIONS = [
  { label: 'Date', value: SortBy.DATE },
  { label: 'Name', value: SortBy.NAME },
  { label: 'Size', value: SortBy.SIZE },
  { label: 'Popularity', value: SortBy.POPULARITY },
];

const getEnvVar = (key: string, fallback: string = '') => {
  return Constants.expoConfig?.extra?.[key] || process.env[key] || fallback;
};

export const API_CONFIG = {
  BASE_URL: getEnvVar(
    'EXPO_PUBLIC_API_BASE_URL',
    'https://openapi.fotoowl.ai/open/event/image-list'
  ),
  DEFAULT_PAGE_SIZE: parseInt(getEnvVar('EXPO_PUBLIC_DEFAULT_PAGE_SIZE', '40'), 10),
  DEFAULT_TIMEOUT: parseInt(getEnvVar('EXPO_PUBLIC_DEFAULT_TIMEOUT', '10000'), 10),
  MAX_RETRIES: parseInt(getEnvVar('EXPO_PUBLIC_MAX_RETRIES', '3'), 10),
  RETRY_DELAY: parseInt(getEnvVar('EXPO_PUBLIC_RETRY_DELAY', '1000'), 10),
  EVENT_ID: getEnvVar('EXPO_PUBLIC_EVENT_ID', '154770'),
  API_KEY: getEnvVar('EXPO_PUBLIC_API_KEY', '4030'),
};

// Validate required environment variables
if (!API_CONFIG.API_KEY || API_CONFIG.API_KEY === '4030') {
  console.warn('⚠️ Using fallback API_KEY. Please set EXPO_PUBLIC_API_KEY in your .env file');
}

if (!API_CONFIG.EVENT_ID || API_CONFIG.EVENT_ID === '154770') {
  console.warn('⚠️ Using fallback EVENT_ID. Please set EXPO_PUBLIC_EVENT_ID in your .env file');
}
