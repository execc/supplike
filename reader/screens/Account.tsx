import * as React from "react";
import { StyleSheet, Button, AsyncStorage } from "react-native";

import { Text, View } from "../components/Themed";
import LoginForm from "../components/LoginForm";
import { accounts, STORAGE_KEY } from "../config";
import { ContractList } from "../components/ContractList";
import {
  Contract,
  Product,
  ContractCreateStatus,
} from "../components/Contract";
import {
  ChainTransitionsInfo,
  Contract as ContractType,
  getContractList,
} from "../service";
import { SCANNED_DATA_STORAGE_KEY } from "./Scanner";

type AccountDetails = {
  password: string;
  role: number;
  user: string;
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
        const contracts: ContractType[] = await getContractList();
        setContracts(contracts);
        setSelectedContractId(null);
      }
    })();
  }, [account]);

  const [contracts, setContracts] = React.useState<ContractType[]>([]);
  const [selectedContractId, setSelectedContractId] = React.useState<
    string | null
  >(null);

  const getProducts = (contractId: string): Product[] => {
    const contract: ContractType = contracts.find(
      ({ id }) => id === contractId
    )!;
    const { role } = accounts[account!];

    const {
      model: {
        layers: [links, nodes],
      },
    } = contract;

    const productsTitle: string[] = Object.values(nodes.models).map(
      ({ title }: any) => title
    );

    const steps = contract.steps.filter((step) => step.role === role);
    const stepsTransitions = steps.map(({ id }) => ({
      id,
      transitions: contract.transitions.filter(({ to }) => to === id),
    }));
    const products: Product[] = stepsTransitions.reduce(
      (products, { id, transitions }): Product[] => {
        if (!transitions.length) {
          products.push({
            id,
            stepId: id,
            title: productsTitle[id - 1] || "Your product",
          });
        } else {
          products = products.concat(
            transitions.map(({ from, to }: ChainTransitionsInfo) => ({
              id: from,
              stepId: id,
              precedentFor: {
                id: to,
                title: productsTitle[to - 1],
              },
              title: productsTitle[from - 1] || `Product №${from}`,
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

  const handleSelectProduct = (id: number) => {
    const params = {
      scan: contracts
        .find(({ id }) => selectedContractId === id)
        ?.products?.find((product) => product.id === id),
    };
    navigation.push("Scanner", params);
    navigation.navigate("Scanner", params);
  };

  type Message = { message: string; type: "success" | "error" };

  const [message, setMessage] = React.useState<Message | null>(null);

  const handleRemoveSelectedContract = async (
    status?: ContractCreateStatus
  ) => {
    setMessage(
      status === undefined
        ? null
        : status === "success"
        ? { message: "Created!", type: "success" }
        : { message: "Failed", type: "error" }
    );
    setTimeout(() => setMessage(null), 2000);
    setSelectedContractId(null);
    await AsyncStorage.setItem(SCANNED_DATA_STORAGE_KEY, JSON.stringify({}));
  };

  const renderAccountInfo = () => (
    <View style={styles.accountInfoContainer}>
      <View style={styles.greetingTextContainer}>
        <Text>Welcome back, {account}</Text>
      </View>
      {message && (
        <View style={styles.messageContainer}>
          <Text>{message.message}</Text>
        </View>
      )}
      {selectedContractId ? (
        <Contract
          account={account!}
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
  messageContainer: {
    width: "100%",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#595",
  },
  button: {
    padding: 10,
  },
});
