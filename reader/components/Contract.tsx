import * as React from "react";
import { StyleSheet, Button, AsyncStorage } from "react-native";

import { Text, View } from "./Themed";

import { Contract as ContractType, createProduct } from "../service";
import { SCANNED_DATA_STORAGE_KEY } from "../screens/Scanner";
import { accounts } from "../config";

export type ProductType = "component" | "product" | "transfer" | "store";

export type Product = {
  // id: number;
  type: ProductType;
  stepId: number;
  title: string;
  precedents: {
    stepId: number;
    title: string;
  }[];
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
    console.log("load stored scan data", data, "previous", scannedData);
    if (data !== JSON.stringify(scannedData)) {
      setScannedData(JSON.parse(data || "{}"));
    }
  })();

  const handleSelectProductFactory = (id: number) => () => {
    console.log("select product to scan", id);
    onSelectProduct(id);
  };

  type ItemToScanInfo = {
    stepId: number;
    title: string;
  };

  const renderItemToScan = ({ stepId, title }: ItemToScanInfo) => {
    console.log("item to scan", stepId, title);
    return (
      <View style={styles.listItem} key={stepId}>
        {scannedData[stepId] ? (
          <Text>
            Scanned {title}: {scannedData[stepId].productId}
          </Text>
        ) : (
          <Button
            title={`Scan ${title}`}
            onPress={handleSelectProductFactory(stepId)}
          />
        )}
      </View>
    );
  };

  const renderProduct = (product: Product) => {
    return [
      ...product.precedents.map(renderItemToScan),
      product.type !== "transfer" &&
        product.type !== "store" &&
        renderItemToScan(product),
    ];
  };

  const [inProccess, setInProccess] = React.useState<boolean>(false);

  const handleCreateProduct = async () => {
    const { id, product } = contract;
    setInProccess(true);
    console.log("create", product, scannedData);

    const newProduct = await createProduct(accounts[account].user, id, {
      id:
        product!.type === "transfer" || product!.type === "store"
          ? scannedData[product!.precedents[0].stepId].productId
          : scannedData[product!.stepId].productId,
      quantity: 1,
      precedents: product!.precedents.map(({ stepId }) => ({
        stepId,
        productId: scannedData[stepId].productId,
      })),
      sid: product!.stepId,
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

  console.log("contract", contract.product, scannedData);

  return (
    <View style={styles.contractContainer}>
      <View style={styles.backWrapper}>
        <Button title="Go back" onPress={() => onBack()} />
      </View>
      <Text style={styles.title}>Select product for {contract.title}</Text>
      <View style={styles.productsContainer}>
        {contract.product ? (
          renderProduct(contract.product)
        ) : (
          <Text>Loading...</Text>
        )}
        {contract.product && (
          <Button
            disabled={
              contract.product.precedents.some(
                ({ stepId }) => !scannedData[stepId]
              ) || inProccess
            }
            title={
              inProccess
                ? "Proccessing..."
                : contract.product.type === "transfer"
                ? "Confirm transfer"
                : contract.product.type === "store"
                ? "Accept product"
                : "Create product"
            }
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
