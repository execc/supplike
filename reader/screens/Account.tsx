import * as React from "react";
import { StyleSheet, Button, AsyncStorage } from "react-native";

import { Text, View } from "../components/Themed";
import LoginForm from "../components/LoginForm";
import { accounts, STORAGE_KEY } from "../config";

type AccountDetails = {
  password: string;
};

export type Accounts = {
  [username: string]: AccountDetails;
};

const ACCOUNT_STORAGE_KEY = `${STORAGE_KEY}:ACOUNT`;

export default function Account() {
  const [account, setAccount] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      const account = await AsyncStorage.getItem(ACCOUNT_STORAGE_KEY);
      if (account && accounts[account]) {
        setAccount(account);
      }
    })();
  });

  const handleLogin = (username: string, password: string): boolean => {
    const details = accounts[username];

    if (details && details.password === password) {
      setAccount(username);
      AsyncStorage.setItem(ACCOUNT_STORAGE_KEY, username);
      return true;
    }

    return false;
  };

  const handleLogout = () => setAccount(null);

  const renderAccountInfo = () => (
    <View style={styles.accountInfoContainer}>
      <View style={styles.greetingTextContainer}>
        <Text>Welcome back, {account}</Text>
      </View>
      <View style={styles.button}>
        <Button title="Logout" onPress={handleLogout} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {account ? renderAccountInfo() : <LoginForm onLogin={handleLogin} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  accountInfoContainer: {
    flex: 1,
  },
  greetingTextContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    padding: 10,
  },
});
