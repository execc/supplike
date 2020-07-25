import * as React from "react";
import { StyleSheet, Button, AsyncStorage } from "react-native";

import { Text, View } from "../components/Themed";
import BarScanner from "../components/BarScanner";
import { useState, useEffect } from "react";
import { ScanResults } from "../components/ScanResults";
import { BarCodeScanningResult } from "expo-camera";
import { STORAGE_KEY } from "../config";

type ScanType = "product" | string;

export const SCANNED_DATA_STORAGE_KEY = `${STORAGE_KEY}:SCANNED_DATA`;

const saveScannedData = async (
  productId: number,
  scannedData: string
): Promise<void> => {
  const storagedData = JSON.parse(
    (await AsyncStorage.getItem(SCANNED_DATA_STORAGE_KEY)) || "{}"
  );
  storagedData[productId] = scannedData;
  await AsyncStorage.setItem(
    SCANNED_DATA_STORAGE_KEY,
    JSON.stringify(storagedData)
  );
  console.log("scan data saved", storagedData);
};

export default function Scanner({
  route: { params },
  navigation: { addListener, navigate, push },
}: any) {
  const [scanType, setScanType] = useState<ScanType>(
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
    let data: any;
    try {
      data = JSON.parse(scannedData);
    } catch (e) {}

    if (!data) {
      return (
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text>Read data error</Text>
          </View>
          <Button
            title={"Tap to Scan Again"}
            onPress={() => setScanned(false)}
          />
        </View>
      );
    }

    if (scanType === "product") {
      return (
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <ScanResults data={data} />
          <Button
            title={"Tap to Scan Again"}
            onPress={() => setScanned(false)}
          />
        </View>
      );
    }

    saveScannedData(params!.scan.stepId, data).then(() => {
      navigate("Account", {
        scannedData: data,
      });
      setScannedData("");
      setScanned(false);
      setScanType("product");
    });
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
