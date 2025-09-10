import React, { useEffect } from "react";
import { View, StyleSheet, ActivityIndicator, Image } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { scale } from "../utils/dimen";
import { useTheme } from "../hooks/useTheme";

type Props = NativeStackScreenProps<RootStackParamList, "Splash">;

export default function SplashScreen({ navigation }: Props) {
  const { colors } = useTheme();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("MainTabs");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Image source={require("../../assets/image/logo.png")} style={styles.image} />
      <ActivityIndicator size='large' color='blue' style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: scale(200),
    height: scale(60),
    resizeMode: "contain",
  },
  loader: {
    marginTop: scale(20),
  },
});
