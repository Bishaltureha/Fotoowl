import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ActionBar from '../ActionBar';

const mockUseTheme = {
  colors: {
    text: '#000000',
  },
};

jest.mock('../../hooks/useTheme', () => ({
  useTheme: () => mockUseTheme,
}));

describe('ActionBar Component', () => {
  const mockOnFavorite = jest.fn();
  const mockOnShare = jest.fn();
  const mockOnSave = jest.fn();

  const defaultProps = {
    isFavorite: false,
    onFavorite: mockOnFavorite,
    onShare: mockOnShare,
    onSave: mockOnSave,
  };

  beforeEach(() => {
    mockOnFavorite.mockClear();
    mockOnShare.mockClear();
    mockOnSave.mockClear();
  });

  it('renders all action buttons', () => {
    const { getByText } = render(<ActionBar {...defaultProps} />);
    expect(getByText('Favorite')).toBeTruthy();
    expect(getByText('Share')).toBeTruthy();
    expect(getByText('Save')).toBeTruthy();
  });

  it('calls onFavorite when favorite button is pressed', () => {
    const { getByText } = render(<ActionBar {...defaultProps} />);
    const favoriteButton = getByText('Favorite');
    fireEvent.press(favoriteButton);
    expect(mockOnFavorite).toHaveBeenCalledTimes(1);
  });

  it('calls onShare when share button is pressed', () => {
    const { getByText } = render(<ActionBar {...defaultProps} />);
    const shareButton = getByText('Share');
    fireEvent.press(shareButton);
    expect(mockOnShare).toHaveBeenCalledTimes(1);
  });

  it('calls onSave when save button is pressed', () => {
    const { getByText } = render(<ActionBar {...defaultProps} />);
    const saveButton = getByText('Save');
    fireEvent.press(saveButton);
    expect(mockOnSave).toHaveBeenCalledTimes(1);
  });

  it('renders favorite button differently when isFavorite is true', () => {
    const { getByTestId } = render(<ActionBar {...defaultProps} isFavorite={true} />);
    const favoriteIcon = getByTestId('favorite-icon');
    expect(favoriteIcon.props.name).toBe('heart');
  });

  it('renders favorite button differently when isFavorite is false', () => {
    const { getByTestId } = render(<ActionBar {...defaultProps} isFavorite={false} />);
    const favoriteIcon = getByTestId('favorite-icon');
    expect(favoriteIcon.props.name).toBe('heart-outline');
  });
});
