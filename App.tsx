import React from "react";
import { StatusBar, SafeAreaView, StyleSheet, View } from "react-native";
import { ThemeProvider, useTheme } from "./src/hooks/useTheme";
import AppNavigator from "./src/navigation/AppNavigator";
import { FavoritesProvider } from "./src/components/FavoritesContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

function MainApp() {
  const { theme, colors } = useTheme();

  return (
    <SafeAreaView style={[styles.mainContainer, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={theme === "light" ? "dark-content" : "light-content"} backgroundColor={colors.background} />
      <AppNavigator />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider style={styles.container}>
      <GestureHandlerRootView style={styles.container}>
        <ThemeProvider>
          <FavoritesProvider>
            <MainApp />
          </FavoritesProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  mainContainer: { flex: 1 },
});
