import React, { FunctionComponent, useState } from "react";
import { StyleSheet, Text, View, SafeAreaView, FlatList, TouchableOpacity, Alert, Modal } from "react-native";
import { useFavorites } from "../components/FavoritesContext";
import Header from "../components/Header";
import Ionicons from "react-native-vector-icons/Ionicons";
import ImageModal from "../components/ImageModal";
import { useTheme } from "../hooks/useTheme";

import { Image } from "expo-image";

const Favourite: FunctionComponent = () => {
  const { favorites, removeFavorite } = useFavorites();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(-1);
  const { colors } = useTheme();

  const handleRemoveFavorite = (item: string) => {
    Alert.alert("Remove Favorite", "Are you sure you want to remove this image from favorites?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => removeFavorite(item),
      },
    ]);
  };

  const renderFavoriteItem = ({ item, index }: { item: string; index: number }) => (
    <View style={[styles.imageWrapper, { backgroundColor: colors.card }]}>
      <TouchableOpacity activeOpacity={0.8} onPress={() => setSelectedImageIndex(index)}>
        <Image cachePolicy='disk' priority='normal' contentFit='cover' source={{ uri: item }} style={styles.image} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.unfavButton, { backgroundColor: colors.unfavButton }]}
        onPress={() => handleRemoveFavorite(item)}
      >
        <Ionicons name='heart-dislike' size={20} color='white' />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title='Favourite' />

      <View style={styles.content}>
        {favorites.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name='heart-outline' size={80} color={colors.icon} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No favorites yet</Text>
            <Text style={[styles.emptySubtitle, { color: colors.secondaryText }]}>
              Tap the heart icon on images to add them to your favorites
            </Text>
          </View>
        ) : (
          <>
            <Text style={[styles.countText, { color: colors.secondaryText }]}>
              {favorites.length} favorite{favorites.length !== 1 ? "s" : ""}
            </Text>

            <FlatList
              data={favorites}
              keyExtractor={(item, index) => `${item}-${index}`}
              numColumns={2}
              renderItem={renderFavoriteItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          </>
        )}
      </View>

      <Modal
        statusBarTranslucent
        visible={selectedImageIndex !== -1}
        animationType='fade'
        presentationStyle='fullScreen'
      >
        <ImageModal images={favorites} initialIndex={selectedImageIndex} onClose={() => setSelectedImageIndex(-1)} />
      </Modal>
    </SafeAreaView>
  );
};

export default Favourite;

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 10 },
  countText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 15,
  },
  listContent: { paddingBottom: 20 },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
    lineHeight: 22,
  },
  imageWrapper: {
    flex: 1,
    margin: 5,
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
    aspectRatio: 1,
    maxWidth: "48%",
  },
  image: { width: "100%", height: "100%", borderRadius: 10 },
  unfavButton: {
    position: "absolute",
    top: 8,
    right: 8,
    borderRadius: 20,
    padding: 6,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
});
