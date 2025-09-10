import React from 'react';
import { render } from '@testing-library/react-native';
import { Animated } from 'react-native';
import SkeletonGrid from '../SkeletonGrid';

describe('SkeletonGrid Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default count of skeleton items', () => {
    const { getAllByTestId } = render(<SkeletonGrid />);
    const skeletonItems = getAllByTestId(/skeleton-item-/);
    expect(skeletonItems).toHaveLength(18);
  });

  it('renders with custom count of skeleton items', () => {
    const customCount = 12;
    const { getAllByTestId } = render(<SkeletonGrid count={customCount} />);
    const skeletonItems = getAllByTestId(/skeleton-item-/);
    expect(skeletonItems).toHaveLength(customCount);
  });

  it('renders zero skeleton items when count is 0', () => {
    const { queryAllByTestId } = render(<SkeletonGrid count={0} />);
    const skeletonItems = queryAllByTestId(/skeleton-item-/);
    expect(skeletonItems).toHaveLength(0);
  });

  it('starts shimmer animation on mount', () => {
    const mockStart = jest.fn();
    const mockAnimation = { start: mockStart, stop: jest.fn(), reset: jest.fn() };
    const mockLoop = jest.fn(() => mockAnimation);
    const mockTiming = jest.fn(() => mockAnimation);

    jest.spyOn(Animated, 'loop').mockImplementation(mockLoop as any);
    jest.spyOn(Animated, 'timing').mockImplementation(mockTiming as any);

    render(<SkeletonGrid />);

    expect(Animated.loop).toHaveBeenCalled();
    expect(mockStart).toHaveBeenCalled();
  });

  it('renders container with proper styles', () => {
    const { getByTestId } = render(<SkeletonGrid />);
    const container = getByTestId('skeleton-grid-container');
    expect(container).toBeTruthy();
  });

  it('renders all skeleton items with shimmer overlay', () => {
    const { getAllByTestId } = render(<SkeletonGrid count={5} />);
    const shimmerOverlays = getAllByTestId(/shimmer-overlay-/);
    expect(shimmerOverlays).toHaveLength(5);
  });

  it('creates unique keys for skeleton items', () => {
    const { getAllByTestId } = render(<SkeletonGrid count={3} />);
    const skeletonItems = getAllByTestId(/skeleton-item-/);

    const testIds = skeletonItems.map(item => item.props.testID);
    const uniqueTestIds = [...new Set(testIds)];

    expect(testIds).toHaveLength(3);
    expect(uniqueTestIds).toHaveLength(3);
  });
});
