import React, { useState, useEffect } from "react";
import { Button, Dimensions } from "react-native";
import { PermissionStatus } from "unimodules-permissions-interface";
import { Text, View } from "./Themed";
import { Camera, BarCodeScanningResult } from "expo-camera";

type BarScannerProps = {
  handleBarCodeScanned: (data: BarCodeScanningResult) => void;
};

export default function BarScanner({ handleBarCodeScanned }: BarScannerProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === PermissionStatus.GRANTED);
    })();
  }, []);

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const { width } = Dimensions.get("window");

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <Camera
        onBarCodeScanned={handleBarCodeScanned}
        style={{ height: width }}
      ></Camera>
    </View>
  );
}
