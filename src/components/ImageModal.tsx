import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Alert, Share, TouchableOpacity, StatusBar, ActivityIndicator } from "react-native";
import { Gesture, GestureDetector, MouseButton } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useFavorites } from "../components/FavoritesContext";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { scale, windowHeight, windowWidth } from "../utils/dimen";
import ActionBar from "../components/ActionBar";
import { useTheme } from "../hooks/useTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
  images: string[];
  initialIndex?: number;
  onClose: () => void;
}

const ImageModal = ({ images, initialIndex = 0, onClose }: Props) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { colors } = useTheme();

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isLoading, setIsLoading] = useState(true);

  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const lastTranslate = { x: 0, y: 0 };
  const maxZoom = 3;
  const minZoom = 1;

  const isZoomed = () => scale.value > 1.01;

  const inset = useSafeAreaInsets();

  useEffect(() => {
    StatusBar.setHidden(true, "fade");
    setCurrentIndex(initialIndex);
    return () => {
      StatusBar.setHidden(false, "fade");
    };
  }, []);

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (isZoomed()) {
        scale.value = withTiming(1);
        translateX.value = withTiming(0);
        translateY.value = withTiming(0);
      } else {
        scale.value = withTiming(2);
      }
    })
    .runOnJS(true);

  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      let newScale = e.scale * scale.value;
      newScale = Math.max(minZoom, Math.min(maxZoom, newScale));
      scale.value = newScale;
    })
    .runOnJS(true);

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      if (isZoomed()) {
        translateX.value = lastTranslate.x + e.translationX;
        translateY.value = lastTranslate.y + e.translationY;
      }
    })
    .onEnd(() => {
      if (isZoomed()) {
        lastTranslate.x = translateX.value;
        lastTranslate.y = translateY.value;
      }
    })
    .runOnJS(true);

  // Fling gesture - left
  const flingLeft = Gesture.Fling()
    .direction(MouseButton.LEFT)
    .onEnd(() => {
      if (!isZoomed()) {
        setIsLoading(true);
        setCurrentIndex((index) => (index <= 0 ? 0 : index - 1));
      }
    })
    .runOnJS(true);

  // Fling gesture - right
  const flingRight = Gesture.Fling()
    .direction(MouseButton.RIGHT)
    .onEnd(() => {
      if (!isZoomed()) {
        setIsLoading(true);
        setCurrentIndex((index) => (index >= images.length - 1 ? images.length - 1 : index + 1));
      }
    })
    .runOnJS(true);

  // Combine gestures
  const gesture = Gesture.Simultaneous(Gesture.Race(flingLeft, flingRight), doubleTap, pan, pinch);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateX: translateX.value }, { translateY: translateY.value }],
  }));

  // Share image
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this image!\n${images[currentIndex]}`,
      });
    } catch (error) {
      Alert.alert("Error", "Unable to share image");
    }
  };

  // Save image
  const handleSave = async () => {
    try {
      const imageUrl = images[currentIndex];
      if (!imageUrl) return;

      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Cannot save image without permission");
        return;
      }

      const fileUri = FileSystem.cacheDirectory + "downloaded.jpg";
      const download = await FileSystem.downloadAsync(imageUrl, fileUri);
      const asset = await MediaLibrary.createAssetAsync(download.uri);
      await MediaLibrary.createAlbumAsync("Download", asset, false);

      Alert.alert("Saved", "Image has been saved to your gallery.");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Unable to save image");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[styles.headerContainer, { marginTop: inset.top }]}
      >
        <TouchableOpacity style={[styles.closeBtn, { backgroundColor: colors.card }]} onPress={onClose}>
          <Text style={[styles.closeText, { color: colors.text }]}>✕</Text>
        </TouchableOpacity>

        <View style={styles.pagination}>
          <Text style={styles.paginationText}>
            {currentIndex + 1} / {images.length}
          </Text>
        </View>
      </View>

      <View style={StyleSheet.absoluteFillObject}>
        <GestureDetector gesture={gesture}>
          <Animated.Image
            onLoadStart={() => setIsLoading(true)}
            onLoad={() => setIsLoading(false)}
            source={{ uri: images[currentIndex] }}
            style={[styles.fullImage, animatedStyle]}
            resizeMode='contain'
          />
        </GestureDetector>
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size='large' color={colors.activeTint} />
          </View>
        )}
      </View>

      <ActionBar
        isFavorite={isFavorite(images[currentIndex])}
        onFavorite={() => toggleFavorite(images[currentIndex])}
        onShare={handleShare}
        onSave={handleSave}
      />
    </View>
  );
};

export default ImageModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  fullImage: {
    width: windowWidth,
    height: windowHeight,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    pointerEvents: "none",
  },
  closeBtn: {
    position: "absolute",
    right: scale(16),
    bottom: scale(0),
    borderRadius: scale(20),
    width: scale(32),
    height: scale(32),
    justifyContent: "center",
    alignItems: "center",
  },
  closeText: {
    fontSize: scale(18),
    fontWeight: "bold",
  },
  pagination: {
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: scale(10),
    paddingHorizontal: scale(12),
    paddingVertical: scale(4),
  },
  paginationText: {
    color: "white",
    fontSize: scale(14),
    fontWeight: "500",
  },
});
