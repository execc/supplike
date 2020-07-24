import * as React from "react";
import { StyleSheet, Button, AsyncStorage } from "react-native";

import { Text, View } from "../components/Themed";
import LoginForm from "../components/LoginForm";
import { accounts, STORAGE_KEY } from "../config";
import { ContractList } from "../components/ContractList";
import { Contract } from "../components/Contract";

type AccountDetails = {
  password: string;
};

export type Accounts = {
  [username: string]: AccountDetails;
};

const ACCOUNT_STORAGE_KEY = `${STORAGE_KEY}:ACOUNT`;

const stubContracts = [
  {
    id: "1",
    products: [
      {
        id: "1",
        title: "berry",
      },
      {
        id: "2",
        title: "milk",
      },
    ],
  },
  {
    id: "2",
    products: [
      {
        id: "1",
        title: "berry",
      },
    ],
  },
];

export default function Account({ navigation }: any) {
  const [account, setAccount] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      const account = await AsyncStorage.getItem(ACCOUNT_STORAGE_KEY);
      if (account && accounts[account]) {
        setAccount(account);
      }
    })();
  });

  const [contracts, setContracts] = React.useState<Contract[]>(
    stubContracts || []
  );
  const [selectedContractId, setSelectedContractId] = React.useState<
    string | null
  >(null);

  const handleLogin = (username: string, password: string): boolean => {
    const details = accounts[username];

    if (details && details.password === password) {
      setAccount(username);
      AsyncStorage.setItem(ACCOUNT_STORAGE_KEY, username);
      return true;
    }

    return false;
  };

  const handleLogout = () => {
    setAccount(null);
    AsyncStorage.setItem(ACCOUNT_STORAGE_KEY, "");
  };

  const handleSelectContract = (contractId: string) => {
    setSelectedContractId(contractId);
  };

  const handleSelectProduct = (productId: string) => {
    const params = {
      scan: stubContracts
        .find(({ id }) => selectedContractId === id)
        ?.products.find(({ id }) => id === productId),
    };
    navigation.push("Scanner", params);
    navigation.navigate("Scanner", params);
  };

  const handleRemoveSelectedContract = () => {
    setSelectedContractId(null);
  };

  const renderAccountInfo = () => (
    <View style={styles.accountInfoContainer}>
      <View style={styles.greetingTextContainer}>
        <Text>Welcome back, {account}</Text>
      </View>
      {selectedContractId ? (
        <Contract
          contract={contracts.find(({ id }) => id === selectedContractId)!}
          onSelectProduct={handleSelectProduct}
          onBack={handleRemoveSelectedContract}
        />
      ) : (
        <ContractList
          contracts={contracts}
          onSelectContract={handleSelectContract}
        />
      )}
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
    width: "100%",
    alignItems: "center",
  },
  greetingTextContainer: {
    width: "100%",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#999",
  },
  button: {
    padding: 10,
  },
});
