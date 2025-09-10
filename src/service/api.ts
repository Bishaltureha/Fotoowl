import { ApiResponse, FetchOptions, PaginatedResponse, SortBy } from '../types';
import { API_CONFIG } from '../utils/constants';
import { calculateDelay, sleep } from '../utils/helpers';

class ImageApiService {
  activeRequests = new Map<string, AbortController>();

  private static instance: ImageApiService;

  static getInstance(): ImageApiService {
    if (!ImageApiService.instance) {
      ImageApiService.instance = new ImageApiService();
    }
    return ImageApiService.instance;
  }

  private buildUrl(options: FetchOptions = {}): string {
    const {
      page = 0,
      pageSize = API_CONFIG.DEFAULT_PAGE_SIZE,
      sortBy = SortBy.DATE,
      ascending = true,
    } = options;

    const params = new URLSearchParams({
      event_id: API_CONFIG.EVENT_ID,
      page: page.toString(),
      page_size: pageSize.toString(),
      key: API_CONFIG.API_KEY,
      order_by: sortBy.toString(),
      order_asc: ascending.toString(),
    });

    return `${API_CONFIG.BASE_URL}?${params.toString()}`;
  }

  cancelAllRequests(): void {
    this.activeRequests.forEach(controller => controller.abort());
    this.activeRequests.clear();
  }

  async fetchWithTimeout(
    url: string,
    options: RequestInit & { timeout?: number } = {}
  ): Promise<Response> {
    const { timeout = API_CONFIG.DEFAULT_TIMEOUT, ...fetchOptions } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: fetchOptions.signal || controller.signal,
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error as Error;
    }
  }

  async customFetch(
    url: string,
    options: RequestInit & { timeout?: number } = {},
    maxRetries: number = API_CONFIG.MAX_RETRIES
  ): Promise<Response> {
    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await this.fetchWithTimeout(url, options);

        // Check if response is ok
        if (!response.ok) {
          const errorMessage = `HTTP ${response.status}: ${response.statusText}`;
          throw errorMessage;
        }

        return response;
      } catch (error) {
        lastError = error as Error;

        // If this was the last attempt, throw the error
        if (attempt >= maxRetries) {
          throw lastError;
        }

        // Don't retry on certain errors
        if (lastError && lastError.name === 'AbortError') {
          throw error;
        }

        // Wait before retrying
        const delay = calculateDelay(attempt);
        console.debug(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
        await sleep(delay);
      }
    }

    throw lastError!;
  }

  async fetchImages(options: FetchOptions = {}): Promise<PaginatedResponse> {
    const requestId = `fetch_${Date.now()}_${Math.random()}`;
    const controller = new AbortController();

    // Store controller for potential cancellation
    this.activeRequests.set(requestId, controller);

    try {
      const url = this.buildUrl(options);

      const response = await this.customFetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: options.timeout,
        signal: options.signal || controller.signal,
      });

      const result: ApiResponse = await response.json();
      const images = result.data?.image_list || [];

      // Determine if there are more pages
      const hasMore = images.length === (options.pageSize || API_CONFIG.DEFAULT_PAGE_SIZE);

      return {
        images,
        hasMore,
        currentPage: options.page || 0,
      };
    } catch (error) {
      if (error instanceof Error) {
        console.error(`API Error [${requestId}]:`, error.message);
      }
      throw error;
    } finally {
      this.activeRequests.delete(requestId);
    }
  }
}

export const imageApi = ImageApiService.getInstance();
