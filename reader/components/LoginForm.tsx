import React, { Component, useState } from "react";
import { Alert, Button, TextInput, View, StyleSheet } from "react-native";

export default function LoginForm() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = () => {
    Alert.alert("Credentials", `${username} + ${password}`);
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder={"Username"}
        style={styles.input}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder={"Password"}
        secureTextEntry={true}
        style={styles.input}
      />

      <Button
        disabled={!username || !password}
        title={"Login"}
        onPress={handleLogin}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: 200,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: "black",
    marginBottom: 10,
  },
  button: {
    width: 200,
    height: 44,
    padding: 10,
  },
});
