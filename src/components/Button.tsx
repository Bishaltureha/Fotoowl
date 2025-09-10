import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import React from "react";

interface ButtonProps {
  title: string;
  onPress: () => void;
  contianerStyle: ViewStyle;
}

const Button = (props: ButtonProps) => {
  return (
    <TouchableOpacity onPress={props.onPress} style={[props.contianerStyle]}>
      <Text>{props.title}</Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({});
