import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@favorites';

export const FavoritesStorage = {
  async getFavorites(): Promise<string[]> {
    try {
      const data = await AsyncStorage.getItem(FAVORITES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading favorites:', error);
      return [];
    }
  },

  async saveFavorites(favorites: string[]): Promise<void> {
    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  },
};

const THEME_KEY = '@app_theme';

export const ThemeStorage = {
  async getTheme(): Promise<'light' | 'dark'> {
    try {
      const value = await AsyncStorage.getItem(THEME_KEY);
      return value === 'dark' ? 'dark' : 'light'; // default light
    } catch (error) {
      console.error('Error loading theme:', error);
      return 'light';
    }
  },

  async saveTheme(theme: 'light' | 'dark'): Promise<void> {
    try {
      await AsyncStorage.setItem(THEME_KEY, theme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  },
};
