import * as React from "react";
import Timeline from "react-native-timeline-flatlist";
import { Text, View } from "./Themed";
const successIcon = require("../assets/images/success.png");
const errorIcon = require("../assets/images/error.png");
import { StyleSheet } from "react-native";

type timelineData = {
  time: string;
  title: string;
  success: boolean;
};

type ScanResultsProps = {
  data: timelineData[];
};

export const ScanResults = ({ data }: ScanResultsProps) => {
  const renderDetail = (rowData: timelineData) => {
    return (
      <View style={{ flex: 1 }}>
        <Text style={[styles.time]}>{rowData.time}</Text>
        <Text style={[styles.title]}>{rowData.title}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Timeline
        data={data.map(({ title, time, success }: timelineData) => ({
          time,
          title,
          icon: success ? successIcon : errorIcon,
        }))}
        descriptionStyle={{ color: "gray" }}
        innerCircle={"icon"}
        lineColor="#4a4"
        circleColor="#a44"
        renderDetail={renderDetail}
        showTime={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 65,
    backgroundColor: "white",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  time: {
    fontSize: 16,
    color: "#999",
  },
});
