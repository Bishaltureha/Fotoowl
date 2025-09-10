import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { scale } from '../utils/dimen';
import { useTheme } from '../hooks/useTheme';

type HeaderProps = {
  title: string;
  showBack?: boolean;
  onBackPress?: () => void;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

const Header = ({
  title,
  showBack = false,
  onBackPress,
  rightIcon,
  onRightPress,
  style,
}: HeaderProps) => {
  const { colors } = useTheme();

  return (
    <View
      testID="header-container"
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
        style,
      ]}
    >
      <View style={styles.side}>
        {showBack && (
          <TouchableOpacity testID="back-button" onPress={onBackPress}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.center}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      </View>

      <View style={[styles.side, styles.right]}>
        {rightIcon && (
          <TouchableOpacity testID="right-button" onPress={onRightPress}>
            <Ionicons name={rightIcon} size={24} color={colors.text} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  side: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: scale(20),
    fontWeight: '700',
  },
  right: {
    right: scale(16),
  },
});
