export type RootStackParamList = {
  Splash: undefined;
  MainTabs: undefined;
};

export type TabParamList = {
  HomeScreen: undefined;
  Favourite: undefined;
  Settings: undefined;
};

export type ImageItem = {
  url: string;
  id: number;
  thumbnail_url: string;
  img_url?: string;
};

export type ApiResponse = {
  data: {
    image_list: ImageItem[];
  };
};

export enum SortBy {
  DATE = 1,
  NAME = 2,
  SIZE = 3,
  POPULARITY = 4,
}

export interface FetchOptions {
  page?: number;
  pageSize?: number;
  sortBy?: SortBy;
  ascending?: boolean;
  timeout?: number;
  signal?: AbortSignal;
}

export interface PaginatedResponse {
  images: ImageItem[];
  hasMore: boolean;
  currentPage: number;
  totalPages?: number;
}
