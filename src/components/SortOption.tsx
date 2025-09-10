import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { SORT_OPTIONS } from '../utils/constants';
import { scale } from '../utils/dimen';
import { SortBy } from '../types';
import { useTheme } from '../hooks/useTheme';

interface SortOptionProps {
  handleSortChange: (sortOption: SortBy, sortOrder: boolean) => void;
  setShowSortOptions: (shouldShow: boolean) => void;
  sortBy: SortBy;
  ascending: boolean;
}

const SortOption = ({
  handleSortChange,
  setShowSortOptions,
  sortBy,
  ascending,
}: SortOptionProps) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.sortOptionsContainer, { backgroundColor: colors.card }]}>
      <Text style={[styles.sortTitle, { color: colors.text }]}>Sort by:</Text>
      {SORT_OPTIONS.map(option => (
        <View key={option.value} style={styles.sortOptionRow}>
          <TouchableOpacity
            style={[
              styles.sortOption,
              { backgroundColor: colors.background },
              sortBy === option.value && { backgroundColor: colors.primary },
            ]}
            onPress={() => handleSortChange(option.value, ascending)}
          >
            <Text
              style={[
                styles.sortOptionText,
                { color: colors.text },
                sortBy === option.value && { color: '#fff' },
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>

          {sortBy === option.value && (
            <TouchableOpacity
              style={[styles.sortDirectionBtn, { backgroundColor: colors.background }]}
              onPress={() => handleSortChange(sortBy, !ascending)}
            >
              <Text style={[styles.sortDirectionText, { color: colors.text }]}>
                {ascending ? '↑' : '↓'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ))}

      <TouchableOpacity
        style={[styles.closeSortBtn, { backgroundColor: colors.background }]}
        onPress={() => setShowSortOptions(false)}
      >
        <Text style={[styles.closeSortText, { color: colors.secondaryText }]}>Close</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SortOption;

const styles = StyleSheet.create({
  sortOptionsContainer: {
    position: 'absolute',
    top: scale(80),
    right: scale(20),
    borderRadius: scale(8),
    padding: scale(16),
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(2) },
    shadowOpacity: 0.25,
    shadowRadius: scale(4),
    zIndex: 1000,
    minWidth: scale(200),
  },
  sortTitle: { fontSize: scale(16), fontWeight: 'bold', marginBottom: scale(12) },
  sortOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(8),
  },
  sortOption: {
    flex: 1,
    paddingVertical: scale(8),
    paddingHorizontal: scale(12),
    borderRadius: scale(6),
  },
  sortOptionText: { fontSize: 14 },
  sortDirectionBtn: { marginLeft: scale(8), padding: scale(8), borderRadius: scale(4) },
  sortDirectionText: { fontSize: scale(16), fontWeight: 'bold' },
  closeSortBtn: {
    marginTop: scale(12),
    paddingVertical: scale(10),
    borderRadius: scale(6),
    alignItems: 'center',
  },
  closeSortText: { fontSize: scale(14), fontWeight: '500' },
});
