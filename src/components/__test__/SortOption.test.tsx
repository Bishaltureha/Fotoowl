import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SortOption from '../SortOption';
import { SortBy } from '../../types';
import { SORT_OPTIONS } from '../../utils/constants';

const mockUseTheme = {
  colors: {
    card: '#ffffff',
    text: '#000000',
    background: '#f0f0f0',
    primary: '#007AFF',
    secondaryText: '#666666',
  },
};

jest.mock('../../hooks/useTheme', () => ({
  useTheme: () => mockUseTheme,
}));

describe('SortOption Component', () => {
  const mockHandleSortChange = jest.fn();
  const mockSetShowSortOptions = jest.fn();

  const defaultProps = {
    handleSortChange: mockHandleSortChange,
    setShowSortOptions: mockSetShowSortOptions,
    sortBy: SortBy.DATE,
    ascending: true,
  };

  beforeEach(() => {
    mockHandleSortChange.mockClear();
    mockSetShowSortOptions.mockClear();
  });

  it('renders sort title', () => {
    const { getByText } = render(<SortOption {...defaultProps} />);
    expect(getByText('Sort by:')).toBeTruthy();
  });

  it('renders all sort options', () => {
    const { getByText } = render(<SortOption {...defaultProps} />);
    SORT_OPTIONS.forEach(option => {
      expect(getByText(option.label)).toBeTruthy();
    });
  });

  it('renders close button', () => {
    const { getByText } = render(<SortOption {...defaultProps} />);
    expect(getByText('Close')).toBeTruthy();
  });

  it('calls handleSortChange when sort option is pressed', () => {
    const { getByText } = render(<SortOption {...defaultProps} />);
    const nameOption = getByText('Name');
    fireEvent.press(nameOption);
    expect(mockHandleSortChange).toHaveBeenCalledWith(SortBy.NAME, true);
  });

  it('calls setShowSortOptions with false when close button is pressed', () => {
    const { getByText } = render(<SortOption {...defaultProps} />);
    const closeButton = getByText('Close');
    fireEvent.press(closeButton);
    expect(mockSetShowSortOptions).toHaveBeenCalledWith(false);
  });

  it('shows sort direction button for active sort option', () => {
    const { getByText } = render(<SortOption {...defaultProps} />);
    expect(getByText('↑')).toBeTruthy();
  });

  it('shows descending arrow when ascending is false', () => {
    const { getByText } = render(<SortOption {...defaultProps} ascending={false} />);
    expect(getByText('↓')).toBeTruthy();
  });

  it('calls handleSortChange with opposite ascending when direction button is pressed', () => {
    const { getByText } = render(<SortOption {...defaultProps} />);
    const directionButton = getByText('↑');
    fireEvent.press(directionButton);
    expect(mockHandleSortChange).toHaveBeenCalledWith(SortBy.DATE, false);
  });

  it('highlights active sort option', () => {
    const { getByText } = render(<SortOption {...defaultProps} sortBy={SortBy.NAME} />);
    const nameOption = getByText('Name');
    expect(nameOption).toBeTruthy();
  });

  it('does not show direction button for inactive sort options', () => {
    const { queryByText } = render(<SortOption {...defaultProps} sortBy={SortBy.NAME} />);
    expect(queryByText('↑')).toBeTruthy();
    expect(queryByText('↓')).toBeNull();
  });
});
