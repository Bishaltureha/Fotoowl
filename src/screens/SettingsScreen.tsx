// screens/SettingsScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { scale } from '../utils/dimen';

const SettingsScreen = () => {
  const { theme, colors, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Settings</Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: isDark ? colors.card : colors.primary }]}
        onPress={toggleTheme}
      >
        <Text style={[styles.buttonText]}>Switch to {isDark ? 'Light' : 'Dark'} Mode</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: scale(20),
  },
  title: {
    fontSize: scale(22),
    fontWeight: '700',
    marginBottom: scale(20),
  },
  button: {
    paddingVertical: scale(12),
    paddingHorizontal: scale(20),
    borderRadius: scale(8),
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
