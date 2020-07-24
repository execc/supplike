import * as React from "react";
import { StyleSheet, Button, AsyncStorage } from "react-native";

import { Text, View } from "./Themed";

import { Contract as ContractType } from "../service";
import { SCANNED_DATA_STORAGE_KEY } from "../screens/Scanner";

export type Product = {
  id: number;
  stepId: number;
  title: string;
};

type ContractProps = {
  contract: ContractType;
  onSelectProduct: (id: number) => void;
  onBack: () => void;
};

type ScannedStorageData = {
  [productId: number]: any;
};

export const Contract = ({
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

  const handleSendBatch = () => {};

  return (
    <View style={styles.contractContainer}>
      <View style={styles.backWrapper}>
        <Button title="Go back" onPress={onBack} />
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
            disabled={contract.products.some(({ id }) => !scannedData[id])}
            title="Send"
            onPress={handleSendBatch}
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
