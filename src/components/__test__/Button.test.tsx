import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from '../Button';

describe('Button Component', () => {
  const mockOnPress = jest.fn();
  const defaultProps = {
    title: 'Test Button',
    onPress: mockOnPress,
    contianerStyle: { backgroundColor: 'blue' },
  };

  beforeEach(() => {
    mockOnPress.mockClear();
  });

  it('renders correctly with title', () => {
    const { getByText } = render(<Button {...defaultProps} />);
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const { getByText } = render(<Button {...defaultProps} />);
    const button = getByText('Test Button');
    fireEvent.press(button);
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('applies container style correctly', () => {
    const customStyle = { backgroundColor: 'red', padding: 10 };
    const { getByText } = render(<Button {...defaultProps} contianerStyle={customStyle} />);
    const buttonContainer = getByText('Test Button').parent?.parent;
    expect(buttonContainer).toHaveStyle(customStyle);
  });

  it('renders with different titles', () => {
    const { rerender, getByText } = render(<Button {...defaultProps} />);
    expect(getByText('Test Button')).toBeTruthy();

    rerender(<Button {...defaultProps} title="New Title" />);
    expect(getByText('New Title')).toBeTruthy();
  });
});
