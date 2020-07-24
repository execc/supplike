import * as React from "react";
import { StyleSheet, Button, AsyncStorage } from "react-native";

import { Text, View } from "../components/Themed";
import LoginForm from "../components/LoginForm";
import { accounts, STORAGE_KEY } from "../config";
import { ContractList } from "../components/ContractList";
import { Contract, Product } from "../components/Contract";
import {
  getChainIdList,
  getChainById,
  Chain,
  ChainTransitionsInfo,
} from "../service";

type AccountDetails = {
  password: string;
  role: number;
};

export type Accounts = {
  [username: string]: AccountDetails;
};

const ACCOUNT_STORAGE_KEY = `${STORAGE_KEY}:ACOUNT`;

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

  React.useEffect(() => {
    (async () => {
      if (account) {
        const chains = await getChainIdList();
        setContracts(
          chains.map((id: string) => ({
            id,
          }))
        );
      }
    })();
  }, [account]);

  const [contracts, setContracts] = React.useState<Contract[]>([]);
  const [selectedContractId, setSelectedContractId] = React.useState<
    string | null
  >(null);

  const getProducts = async (contractId: string): Promise<Product[]> => {
    const chain: Chain = await getChainById(contractId);
    const { role } = accounts[account!];

    const steps = chain.steps.filter((step) => step.role === role);
    const stepsTransitions = steps.map(({ id }) => ({
      id,
      transitions: chain.transitions.filter(({ to }) => to === id),
    }));
    const products: Product[] = stepsTransitions.reduce(
      (products, { id, transitions }): Product[] => {
        if (!transitions.length) {
          products.push({
            id: Math.random().toString(),
            title: "Your product",
          });
        } else {
          products = products.concat(
            transitions.map(({ from }: ChainTransitionsInfo) => ({
              id: Math.random().toString(),
              title: `Product №${from}`,
            }))
          );
        }

        return products;
      },
      [] as Product[]
    );

    const newContracts = [...contracts];
    const updatedContract = newContracts.find(({ id }) => id === contractId)!;
    updatedContract.products = products;
    console.log(newContracts);
    setContracts(newContracts);

    return products;
  };

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
    if (!contracts.find(({ id }) => contractId === id)!.products) {
      getProducts(contractId);
    }
  };

  const handleSelectProduct = (productId: string) => {
    const params = {
      scan: contracts
        .find(({ id }) => selectedContractId === id)
        ?.products?.find(({ id }) => id === productId),
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
