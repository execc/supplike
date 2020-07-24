import * as React from "react";
import { StyleSheet, Button } from "react-native";

import { Text, View } from "../components/Themed";
import BarScanner from "../components/BarScanner";
import { useState, useEffect } from "react";
import { ScanResults } from "../components/ScanResults";
import { BarCodeScanningResult } from "expo-camera";

type ScanType = "product" | string;

export default function Scanner({
  route: { params },
  navigation: { addListener },
}: any) {
  const [scanType] = useState<ScanType>(
    (params && params.scan.title) || "product"
  );
  const [focused, setFocused] = useState<boolean>(false);
  let focusListener: any;
  let blurListener: any;

  useEffect(() => {
    focusListener = addListener("focus", () => setFocused(true));
    blurListener = addListener("blur", () => setFocused(false));

    return () => {
      focusListener && focusListener();
      blurListener && blurListener();
    };
  });

  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState<string>("");

  const handleBarCodeScanned = ({ data }: BarCodeScanningResult) => {
    setScanned(true);
    setScannedData(data);
  };

  if (!focused) {
    return <View />;
  }

  if (scanned) {
    let data;
    try {
      data = JSON.parse(scannedData);
    } catch (e) {}

    if (scanType === "product") {
      return (
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          {data ? (
            <ScanResults data={data} />
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>Read data error</Text>
            </View>
          )}
          <Button
            title={"Tap to Scan Again"}
            onPress={() => setScanned(false)}
          />
        </View>
      );
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.scanInfoContainer}>
        <Text>Scan a {scanType}</Text>
      </View>
      <BarScanner handleBarCodeScanned={handleBarCodeScanned} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scanInfoContainer: {
    width: "100%",
    alignItems: "center",
    padding: 10,
  },
});
