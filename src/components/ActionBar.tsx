import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { scale } from '../utils/dimen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';

interface ActionBarProps {
  isFavorite: boolean;
  onFavorite: () => void;
  onShare: () => void;
  onSave: () => void;
}

const ActionBar: React.FC<ActionBarProps> = ({ isFavorite, onFavorite, onShare, onSave }) => {
  const inset = useSafeAreaInsets();
  const { colors } = useTheme();
  return (
    <View style={[styles.actionBar, { marginBottom: inset.bottom }]}>
      <TouchableOpacity style={styles.actionBtn} onPress={onFavorite}>
        <Icon
          testID="favorite-icon"
          name={isFavorite ? 'heart' : 'heart-outline'}
          size={26}
          color={isFavorite ? 'red' : colors.text}
        />
        <Text style={[styles.actionText, { color: colors.text }]}>Favorite</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionBtn} onPress={onShare}>
        <Icon testID="share-icon" name="share-outline" size={26} color={colors.text} />
        <Text style={[styles.actionText, { color: colors.text }]}>Share</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionBtn} onPress={onSave}>
        <Icon testID="save-icon" name="download-outline" size={26} color={colors.text} />
        <Text style={[styles.actionText, { color: colors.text }]}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ActionBar;

const styles = StyleSheet.create({
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    borderRadius: scale(20),
    padding: scale(10),
    alignSelf: 'center',
    zIndex: 10,
  },
  actionBtn: {
    alignItems: 'center',
  },
  actionText: {
    fontSize: scale(12),
    marginTop: scale(2),
  },
});
