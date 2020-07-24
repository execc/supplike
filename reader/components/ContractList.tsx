import * as React from "react";
import { StyleSheet, Button } from "react-native";

import { Text, View } from "../components/Themed";
import { Contract } from "../service";

type ContractListProps = {
  onSelectContract: (contractId: string) => void;
  contracts: Contract[];
};

export const ContractList = ({
  onSelectContract,
  contracts,
}: ContractListProps) => {
  console.log(contracts);
  const handleSelectContractFactory = (contractId: string) => () =>
    onSelectContract(contractId);

  const renderContract = ({ id, title }: Contract) => {
    return (
      <View style={styles.listItem} key={id}>
        <Button title={title} onPress={handleSelectContractFactory(id)} />
      </View>
    );
  };

  return (
    <View style={styles.contractListContainer}>
      {contracts.length ? (
        contracts.map(renderContract)
      ) : (
        <View style={styles.emptyListContainer}>
          <Text>There are no contracts</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  contractListContainer: {
    flex: 1,
    alignItems: "center",
    width: "100%",
  },
  emptyListContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  listItem: {
    width: "100%",
    padding: 10,
  },
});
