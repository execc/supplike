import * as React from "react";
import { StyleSheet, Button, AsyncStorage } from "react-native";

import { Text, View } from "./Themed";

import { Contract as ContractType, createProduct } from "../service";
import { SCANNED_DATA_STORAGE_KEY } from "../screens/Scanner";
import { accounts } from "../config";

export type Product = {
  id: number;
  stepId: number;
  title: string;
  precedentFor?: {
    id: number;
    title: string;
  };
};

export type ContractCreateStatus = "success" | "fail";

type ContractProps = {
  account: string;
  contract: ContractType;
  onSelectProduct: (id: number) => void;
  onBack: (status?: ContractCreateStatus) => void;
};

type ScannedStorageData = {
  [productId: number]: any;
};

export const Contract = ({
  account,
  contract,
  onSelectProduct,
  onBack,
}: ContractProps) => {
  const [scannedData, setScannedData] = React.useState<ScannedStorageData>({});

  (async () => {
    const data = await AsyncStorage.getItem(SCANNED_DATA_STORAGE_KEY);
    setScannedData(JSON.parse(data || "{}"));
  })();

  const handleSelectProductFactory = (id: number) => () => onSelectProduct(id);

  const renderProduct = ({ id, title }: Product) => {
    return (
      <View style={styles.listItem} key={id}>
        {scannedData[id] ? (
          <Text>
            Scanned {title}: {scannedData[id].productId}
          </Text>
        ) : (
          <Button
            title={`Scan ${title}`}
            onPress={handleSelectProductFactory(id)}
          />
        )}
      </View>
    );
  };

  const [inProccess, setInProccess] = React.useState<boolean>(false);

  const handleCreateProduct = async () => {
    const { id, products } = contract;
    setInProccess(true);
    console.log("create", products, scannedData);

    const newProduct = await createProduct(accounts[account].user, id, {
      quantity: 1,
      precedents:
        products!.length === 1
          ? []
          : products!.map(({ id }) => scannedData[id].productId),
      sid: products![0].stepId,
    });

    console.log("created", newProduct);
    setInProccess(false);
    onBack("success");
    // createProduct(id, {
    //   quantity: 1,
    //   precedents: (products.length === 1) ? [] : ,
    //   sid: pro
    // });
  };

  return (
    <View style={styles.contractContainer}>
      <View style={styles.backWrapper}>
        <Button title="Go back" onPress={() => onBack()} />
      </View>
      <Text style={styles.title}>Select product for {contract.title}</Text>
      <View style={styles.productsContainer}>
        {contract.products ? (
          contract.products.map(renderProduct)
        ) : (
          <Text>Loading...</Text>
        )}
        {contract.products && (
          <Button
            disabled={
              contract.products.some(({ id }) => !scannedData[id]) || inProccess
            }
            title={inProccess ? "Creating..." : "Create product"}
            onPress={handleCreateProduct}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contractContainer: {
    flex: 1,
    alignItems: "center",
    width: "100%",
  },
  productsContainer: {
    flex: 1,
    alignItems: "center",
    width: "100%",
  },
  listItem: {
    width: "100%",
    padding: 10,
  },
  backWrapper: {
    padding: 10,
  },
  title: {
    fontSize: 20,
    textAlign: "center",
  },
});
