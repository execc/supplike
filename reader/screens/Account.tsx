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
  user: string;
};

export type Accounts = {
  [username: string]: AccountDetails;
};

const ACCOUNT_STORAGE_KEY = `${STORAGE_KEY}:ACOUNT`;

export default function Account({ navigation, route: { params } }: any) {
  const [focused, setFocused] = React.useState<boolean>(false);
  let focusListener: any;
  let blurListener: any;

  React.useEffect(() => {
    focusListener = navigation.addListener("focus", () => setFocused(true));
    blurListener = navigation.addListener("blur", () => setFocused(false));

    return () => {
      focusListener && focusListener();
      blurListener && blurListener();
    };
  });

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

  const getProduct = (contractId: string): Product | null => {
    const contract: ContractType = contracts.find(
      ({ id }) => id === contractId
    )!;
    const { user } = accounts[account!];
    const role = contract.assignedRoles[user];

    const {
      model: {
        layers: [links, nodes],
      },
    } = contract;

    type Node = {
      title: string;
      nodeType: string;
    };
    const productsNode: Node[] = Object.values(nodes.models).map(
      ({ title, nodeType }: any) => ({
        title,
        nodeType,
      })
    );

    let product: Product | null = null;
    const step = contract.steps.find((step) => step.role === role);
    if (step) {
      const transitions = contract.transitions.filter(
        ({ to }) => to === step.id
      );

      const node = productsNode[step.id - 1];

      product = {
        // id: step.id,
        stepId: step.id,
        type: node.nodeType === "link" ? "transfer" : "product",
        title: node.title || "Your product",
        precedents: transitions.map(({ from }) => ({
          stepId: from,
          title: productsNode[from - 1].title || `Product №${from}`,
        })),
      };
    }

    if (product) {
      const newContracts = [...contracts];
      const updatedContract = newContracts.find(({ id }) => id === contractId)!;
      updatedContract.product = product;
      setContracts(newContracts);
    }

    return product;
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
    if (!contracts.find(({ id }) => contractId === id)!.product) {
      getProduct(contractId);
    }
  };

  const handleSelectProduct = (stepId: number) => {
    const product = contracts.find(({ id }) => selectedContractId === id)!
      .product!;
    const productInfo =
      product.stepId === stepId
        ? product
        : product.precedents.find((product) => product.stepId === stepId);
    const params = {
      scan: productInfo,
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

  if (!focused) {
    return null;
  }

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
