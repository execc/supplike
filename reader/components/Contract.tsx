import * as React from "react";
import { StyleSheet, Button } from "react-native";

import { Text, View } from "./Themed";

type Product = {
  id: string;
  title: string;
};

export type Contract = {
  id: string;
  products: Product[];
};

type ContractProps = {
  contract: Contract;
  onSelectProduct: (productId: string) => void;
  onBack: () => void;
};

export const Contract = ({
  contract,
  onSelectProduct,
  onBack,
}: ContractProps) => {
  const handleSelectContractFactory = (productId: string) => () =>
    onSelectProduct(productId);

  const renderProduct = ({ id, title }: Product) => {
    return (
      <View style={styles.listItem} key={id}>
        <Button title={title} onPress={handleSelectContractFactory(id)} />
      </View>
    );
  };

  return (
    <View style={styles.contractContainer}>
      <Button title="Go back" onPress={onBack} />
      <View style={styles.productsContainer}>
        {contract.products.map(renderProduct)}
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
});
