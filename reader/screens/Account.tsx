import * as React from "react";
import { StyleSheet } from "react-native";

import { Text, View } from "../components/Themed";
import LoginForm from "../components/LoginForm";

export default function Account() {
  return (
    <View style={styles.container}>
      <LoginForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
