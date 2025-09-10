import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import Favourite from "../screens/Favourite";
import SettingsScreen from "../screens/SettingsScreen";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../hooks/useTheme";
import { TabParamList } from "../types";
import { scale } from "../utils/dimen";
import { StyleSheet } from "react-native";

const Tab = createBottomTabNavigator<TabParamList>();

export default function MainTabs() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          paddingBottom: 0,
          height: scale(60),
          paddingTop: scale(8),
        },
        tabBarActiveTintColor: colors.activeTint,
        tabBarInactiveTintColor: colors.inActiveTint,
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "HomeScreen") {
            iconName = "home";
          } else if (route.name === "Favourite") {
            iconName = "heart";
          } else {
            iconName = "settings";
          }

          return <Ionicons name={iconName} size={size} color={color} style={styles.icon} />;
        },
      })}
    >
      <Tab.Screen name='HomeScreen' component={HomeScreen} />
      <Tab.Screen name='Favourite' component={Favourite} />
      <Tab.Screen name='Settings' component={SettingsScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  icon: {
    marginBottom: scale(4),
  },
});
