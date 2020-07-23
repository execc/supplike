import React, { useState } from "react";
import { Button, TextInput, StyleSheet } from "react-native";
import { Text, View } from "../components/Themed";

type LoginFormProps = {
  onLogin: (username: string, password: string) => boolean;
};

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleLogin = () => {
    const successLogin = onLogin(username, password);
    setMessage(successLogin ? "" : "Try again");
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
      <Text style={styles.message}>{message}</Text>
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
  message: {
    color: "#a00",
  },
});
