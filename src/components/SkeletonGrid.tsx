import { StyleSheet, View, Animated, Dimensions, Easing } from "react-native";
import React, { FunctionComponent, useEffect, useRef } from "react";
import { scale, windowWidth } from "../utils/dimen";

interface SkeletonGridProps {
  count?: number;
}

const SkeletonGrid: FunctionComponent<SkeletonGridProps> = ({ count = 18 }) => {
  const shimmerValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateX = shimmerValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, windowWidth],
  });

  const renderSkeletonItem = (index: number) => (
    <View key={index} style={styles.subcontainer}>
      <View style={styles.skeletonContent}>
        <Animated.View style={[styles.shimmerOverlay, { transform: [{ translateX }] }]} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.grid}>{Array.from({ length: count }, (_, index) => renderSkeletonItem(index))}</View>
    </View>
  );
};

export default SkeletonGrid;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: scale(16),
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: scale(16),
  },
  subcontainer: {
    width: scale(125),
    height: scale(125),
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
    borderRadius: scale(5),
  },
  skeletonContent: {
    flex: 1,
    backgroundColor: "#e0e0e0",
    borderRadius: scale(8),
    overflow: "hidden",
  },
  shimmerOverlay: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: scale(100),
    backgroundColor: "rgba(255,255,255,0.4)",
  },
});
