import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Text,
  Button,
  Alert,
  FlatList,
  Modal,
} from "react-native";
import SkeletonGrid from "../components/SkeletonGrid";
import { scale, windowWidth } from "../utils/dimen";
import ImageModal from "../components/ImageModal";
import Header from "../components/Header";
import { useTheme } from "../hooks/useTheme";
import { FetchOptions, ImageItem, PaginatedResponse, SortBy as SortByType } from "../types";
import { imageApi } from "../service/api";
import SortOption from "../components/SortOption";
import { Image } from "expo-image";
import { Data } from "../utils/temp";
import { unstable_batchedUpdates } from "react-native";

const ITEM_HEIGHT = (windowWidth - scale(48)) / 3;

const HomeScreen = () => {
  const { colors } = useTheme();

  // State management
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [data, setData] = useState<ImageItem[]>(
    // Data.data.image_list.map((item) => ({ id: item.id, thumbnail_url: item.thumbnail_url, url: item.img_url }))
    []
  );
  const [isloading, setIsloading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(-1);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Sorting state
  const [sortBy, setSortBy] = useState<SortByType>(SortByType.DATE);
  const [ascending, setAscending] = useState<boolean>(true);
  const [showSortOptions, setShowSortOptions] = useState<boolean>(false);

  const fetchInitialData = async (resetData = false, params: FetchOptions = {}) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (resetData) {
      setIsloading(true);
    }

    abortControllerRef.current = new AbortController();

    setError(null);

    try {
      const result = await imageApi.fetchImages({
        page: 0,
        pageSize: 40,
        sortBy,
        ascending,
        signal: abortControllerRef.current.signal,
        ...params,
      });

      unstable_batchedUpdates(() => {
        setData(
          result.images.map((item) => ({ id: item.id, thumbnail_url: item.thumbnail_url, url: item.img_url ?? "" }))
        );
        setCurrentPage(0);
        setHasMore(result.hasMore);
      });
    } catch (err) {
      setError("Failed to load images");
    } finally {
      setIsloading(false);
    }
  };

  const loadMoreData = async () => {
    setLoadingMore(true);

    try {
      const nextPage = currentPage + 1;
      const result: PaginatedResponse = await imageApi.fetchImages({
        page: nextPage,
        pageSize: 40,
        sortBy,
        ascending,
        signal: abortControllerRef.current?.signal,
      });

      unstable_batchedUpdates(() => {
        setData((prev) => [...prev, ...result.images]);
        setCurrentPage(nextPage);
        setHasMore(result.hasMore);
      });
    } catch (err) {
      Alert.alert("Error", "Failed to load more images");
    } finally {
      setLoadingMore(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchInitialData();
    setRefreshing(false);
  };

  const handleRetry = () => {
    fetchInitialData(true);
  };

  const handleSortChange = useCallback(async (newSortBy: SortByType, newAscending: boolean) => {
    unstable_batchedUpdates(() => {
      setSortBy(newSortBy);
      setAscending(newAscending);
      setShowSortOptions(false);
    });
    await fetchInitialData(true, { ascending: newAscending, sortBy: newSortBy });
  }, []);

  useEffect(() => {
    fetchInitialData(true);
  }, []);

  const renderItem = useCallback(
    ({ item, index }: { item: ImageItem; index: number }) => (
      <TouchableOpacity
        style={[styles.subcontainer, { backgroundColor: colors.card }]}
        activeOpacity={0.8}
        onPress={() => {
          setSelectedImageIndex(index);
        }}
      >
        <Image
          cachePolicy='disk'
          priority='normal'
          contentFit='cover'
          source={{ uri: item.thumbnail_url }}
          style={styles.image}
        />
      </TouchableOpacity>
    ),
    [colors]
  );

  const renderSortOptions = () => {
    if (!showSortOptions) return null;

    return (
      <SortOption
        ascending={ascending}
        sortBy={sortBy}
        handleSortChange={handleSortChange}
        setShowSortOptions={setShowSortOptions}
      />
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size='large' color={colors.primary} />
        <Text style={[styles.footerText, { color: colors.secondaryText }]}>Loading more...</Text>
      </View>
    );
  };

  const renderUi = () => {
    if (isloading) {
      return <SkeletonGrid />;
    }

    if (error) {
      return (
        <View style={styles.centerWrapper}>
          <Text style={[styles.errorText, { color: colors.error }]}>⚠️ {error}</Text>
          <Button title='Retry' onPress={handleRetry} />
        </View>
      );
    }

    if (data.length === 0) {
      return (
        <View style={styles.centerWrapper}>
          <Text style={[styles.emptyText, { color: colors.secondaryText }]}>No images found</Text>
          <Button title='Retry' onPress={handleRetry} />
        </View>
      );
    }

    return (
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.2}
        horizontal={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        numColumns={3}
        ListFooterComponent={renderFooter}
        style={styles.flatlistStyle}
        contentContainerStyle={styles.flatlistContent}
        columnWrapperStyle={styles.flatlistColumn}
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        windowSize={7}
        removeClippedSubviews={true}
        updateCellsBatchingPeriod={50}
        getItemLayout={(_, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
      />
    );
  };

  return (
    <View style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.headerWrapper}>
        <Header title='Gallery' rightIcon='funnel' onRightPress={() => setShowSortOptions(true)} />
      </View>

      {renderSortOptions()}
      {renderUi()}

      <Modal
        statusBarTranslucent
        visible={selectedImageIndex !== -1}
        animationType='fade'
        presentationStyle='fullScreen'
      >
        <ImageModal
          images={data.map((img) => img.url)}
          initialIndex={selectedImageIndex}
          onClose={() => setSelectedImageIndex(-1)}
        />
      </Modal>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: {},
  flatlistStyle: {
    marginHorizontal: scale(16),
    marginTop: -scale(6),
  },
  flatlistContent: {
    paddingBottom: scale(16),
    paddingTop: scale(8),
    gap: scale(8),
  },
  flatlistColumn: {
    justifyContent: "space-between",
  },
  headerWrapper: {
    alignItems: "center",
    marginBottom: scale(16),
  },
  subcontainer: {
    width: ITEM_HEIGHT,
    height: ITEM_HEIGHT,
    borderRadius: scale(5),
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  centerWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: scale(16),
    marginBottom: scale(10),
    textAlign: "center",
    paddingHorizontal: scale(20),
  },
  emptyText: {
    fontSize: scale(16),
    marginBottom: scale(10),
  },
  footer: {
    paddingVertical: scale(20),
    marginBottom: scale(32),
    alignItems: "center",
  },
  footerText: {
    marginTop: scale(10),
    fontSize: scale(14),
  },
});
