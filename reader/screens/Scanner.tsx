import * as React from "react";
import { StyleSheet, Button } from "react-native";

import { Text, View } from "../components/Themed";
import BarScanner from "../components/BarScanner";
import { useState, useEffect } from "react";
import { ScanResults } from "../components/ScanResults";
import { BarCodeScanningResult } from "expo-camera";

export default function Scanner({ navigation: { addListener } }: any) {
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
        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
      </View>
    );
  }

  return <BarScanner handleBarCodeScanned={handleBarCodeScanned} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
