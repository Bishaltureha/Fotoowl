import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { ThemeProvider, useTheme } from './src/hooks/useTheme';
import AppNavigator from './src/navigation/AppNavigator';
import { FavoritesProvider } from './src/components/FavoritesContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

function MainApp() {
  const { theme, colors } = useTheme();

  return (
    <SafeAreaView style={[styles.mainContainer, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={theme === 'light' ? 'dark-content' : 'light-content'}
        backgroundColor={colors.background}
      />
      <AppNavigator />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider style={styles.container}>
        <ThemeProvider>
          <FavoritesProvider>
            <MainApp />
          </FavoritesProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  mainContainer: { flex: 1 },
});
