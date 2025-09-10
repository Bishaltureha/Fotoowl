import { SortBy } from '../types';

export const SORT_OPTIONS = [
  { label: 'Date', value: SortBy.DATE },
  { label: 'Name', value: SortBy.NAME },
  { label: 'Size', value: SortBy.SIZE },
  { label: 'Popularity', value: SortBy.POPULARITY },
];

export const API_CONFIG = {
  BASE_URL: 'https://openapi.fotoowl.ai/open/event/image-list',
  DEFAULT_PAGE_SIZE: 40,
  DEFAULT_TIMEOUT: 10000, // 10 seconds
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second base delay
  EVENT_ID: '154770',
  API_KEY: '4030',
};
