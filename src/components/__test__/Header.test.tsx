import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Header from '../Header';

const mockUseTheme = {
  colors: {
    background: '#ffffff',
    text: '#000000',
  },
};

jest.mock('../../hooks/useTheme', () => ({
  useTheme: () => mockUseTheme,
}));

describe('Header Component', () => {
  const mockOnBackPress = jest.fn();
  const mockOnRightPress = jest.fn();

  beforeEach(() => {
    mockOnBackPress.mockClear();
    mockOnRightPress.mockClear();
  });

  it('renders title correctly', () => {
    const { getByText } = render(<Header title="Test Title" />);
    expect(getByText('Test Title')).toBeTruthy();
  });

  it('renders back button when showBack is true', () => {
    const { getByTestId } = render(
      <Header title="Test" showBack={true} onBackPress={mockOnBackPress} />
    );
    const backButton = getByTestId('back-button');
    expect(backButton).toBeTruthy();
  });

  it('calls onBackPress when back button is pressed', () => {
    const { getByTestId } = render(
      <Header title="Test" showBack={true} onBackPress={mockOnBackPress} />
    );
    const backButton = getByTestId('back-button');
    fireEvent.press(backButton);
    expect(mockOnBackPress).toHaveBeenCalledTimes(1);
  });

  it('does not render back button when showBack is false', () => {
    const { queryByTestId } = render(<Header title="Test" showBack={false} />);
    expect(queryByTestId('back-button')).toBeNull();
  });

  it('renders right icon when provided', () => {
    const { getByTestId } = render(
      <Header title="Test" rightIcon="settings" onRightPress={mockOnRightPress} />
    );
    const rightButton = getByTestId('right-button');
    expect(rightButton).toBeTruthy();
  });

  it('calls onRightPress when right button is pressed', () => {
    const { getByTestId } = render(
      <Header title="Test" rightIcon="settings" onRightPress={mockOnRightPress} />
    );
    const rightButton = getByTestId('right-button');
    fireEvent.press(rightButton);
    expect(mockOnRightPress).toHaveBeenCalledTimes(1);
  });

  it('does not render right icon when not provided', () => {
    const { queryByTestId } = render(<Header title="Test" />);
    expect(queryByTestId('right-button')).toBeNull();
  });

  it('applies custom style correctly', () => {
    const customStyle = { paddingTop: 20 };
    const { getByTestId } = render(<Header title="Test" style={customStyle} />);
    const container = getByTestId('header-container');
    expect(container).toHaveStyle(customStyle);
  });
});
