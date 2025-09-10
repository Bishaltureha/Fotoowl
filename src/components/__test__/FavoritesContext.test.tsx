import React from 'react';
import { render, act, waitFor, fireEvent } from '@testing-library/react-native';
import { Text, TouchableOpacity } from 'react-native';
import { FavoritesProvider, useFavorites } from '../FavoritesContext';
import { FavoritesStorage } from '../../storage/Storage';

jest.mock('../../storage/Storage');

const TestComponent = () => {
  const {
    favorites,
    toggleFavorite,
    isFavorite,
    removeFavorite,
    clearAllFavorites,
    favoritesCount,
  } = useFavorites();

  return (
    <>
      <Text testID="favorites-count">{favoritesCount}</Text>
      <Text testID="favorites-list">{JSON.stringify(favorites)}</Text>
      <TouchableOpacity testID="toggle-favorite" onPress={() => toggleFavorite('image1.jpg')}>
        <Text>Toggle Favorite</Text>
      </TouchableOpacity>
      <TouchableOpacity testID="remove-favorite" onPress={() => removeFavorite('image1.jpg')}>
        <Text>Remove Favorite</Text>
      </TouchableOpacity>
      <TouchableOpacity testID="clear-favorites" onPress={() => clearAllFavorites()}>
        <Text>Clear All</Text>
      </TouchableOpacity>
      <Text testID="is-favorite">{isFavorite('image1.jpg').toString()}</Text>
    </>
  );
};

const TestComponentWithProvider = () => (
  <FavoritesProvider>
    <TestComponent />
  </FavoritesProvider>
);

describe('FavoritesContext', () => {
  const mockGetFavorites = FavoritesStorage.getFavorites as jest.Mock;
  const mockSaveFavorites = FavoritesStorage.saveFavorites as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetFavorites.mockResolvedValue([]);
    mockSaveFavorites.mockResolvedValue(undefined);
  });

  it('loads favorites on mount', async () => {
    const initialFavorites = ['image1.jpg', 'image2.jpg'];
    mockGetFavorites.mockResolvedValue(initialFavorites);

    const { getByTestId } = render(<TestComponentWithProvider />);

    await waitFor(() => {
      expect(getByTestId('favorites-count')).toHaveTextContent('2');
      expect(getByTestId('favorites-list')).toHaveTextContent(JSON.stringify(initialFavorites));
    });
  });

  it('handles load favorites error gracefully', async () => {
    mockGetFavorites.mockRejectedValue(new Error('Storage error'));

    const { getByTestId } = render(<TestComponentWithProvider />);

    await waitFor(() => {
      expect(getByTestId('favorites-count')).toHaveTextContent('0');
      expect(getByTestId('favorites-list')).toHaveTextContent('[]');
    });
  });

  it('adds favorite when toggling non-favorite item', async () => {
    const { getByTestId } = render(<TestComponentWithProvider />);

    await waitFor(() => {
      expect(getByTestId('is-favorite')).toHaveTextContent('false');
    });

    await act(async () => {
      fireEvent.press(getByTestId('toggle-favorite'));
    });

    await waitFor(() => {
      expect(getByTestId('is-favorite')).toHaveTextContent('true');
      expect(getByTestId('favorites-count')).toHaveTextContent('1');
      expect(mockSaveFavorites).toHaveBeenCalledWith(['image1.jpg']);
    });
  });

  it('removes favorite when toggling favorite item', async () => {
    mockGetFavorites.mockResolvedValue(['image1.jpg']);
    const { getByTestId } = render(<TestComponentWithProvider />);

    await waitFor(() => {
      expect(getByTestId('is-favorite')).toHaveTextContent('true');
    });

    await act(async () => {
      fireEvent.press(getByTestId('toggle-favorite'));
    });

    await waitFor(() => {
      expect(getByTestId('is-favorite')).toHaveTextContent('false');
      expect(getByTestId('favorites-count')).toHaveTextContent('0');
      expect(mockSaveFavorites).toHaveBeenCalledWith([]);
    });
  });

  it('removes specific favorite', async () => {
    mockGetFavorites.mockResolvedValue(['image1.jpg', 'image2.jpg']);
    const { getByTestId } = render(<TestComponentWithProvider />);

    await waitFor(() => {
      expect(getByTestId('favorites-count')).toHaveTextContent('2');
    });

    await act(async () => {
      fireEvent.press(getByTestId('remove-favorite'));
    });

    await waitFor(() => {
      expect(getByTestId('favorites-count')).toHaveTextContent('1');
      expect(mockSaveFavorites).toHaveBeenCalledWith(['image2.jpg']);
    });
  });

  it('clears all favorites', async () => {
    mockGetFavorites.mockResolvedValue(['image1.jpg', 'image2.jpg']);
    const { getByTestId } = render(<TestComponentWithProvider />);

    await waitFor(() => {
      expect(getByTestId('favorites-count')).toHaveTextContent('2');
    });

    await act(async () => {
      fireEvent.press(getByTestId('clear-favorites'));
    });

    await waitFor(() => {
      expect(getByTestId('favorites-count')).toHaveTextContent('0');
      expect(mockSaveFavorites).toHaveBeenCalledWith([]);
    });
  });

  it('handles save favorites error gracefully', async () => {
    mockSaveFavorites.mockRejectedValue(new Error('Save error'));
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    const { getByTestId } = render(<TestComponentWithProvider />);

    await act(async () => {
      fireEvent.press(getByTestId('toggle-favorite'));
    });

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to save favorites:', expect.any(Error));
    });

    consoleErrorSpy.mockRestore();
  });

  it('throws error when useFavorites is used outside provider', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    expect(() => render(<TestComponent />)).toThrow(
      'useFavorites must be used inside FavoritesProvider'
    );

    consoleErrorSpy.mockRestore();
  });
});
