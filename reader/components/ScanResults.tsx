import * as React from "react";
import Timeline from "react-native-timeline-flatlist";
import { Text, View } from "./Themed";
const successIcon = require("../assets/images/success.png");
const errorIcon = require("../assets/images/error.png");
import { StyleSheet } from "react-native";
import { TimelineData, getProductTimeLineForUser } from "../service";
import { useState } from "react";

type ScanResultsProps = {
  data: {
    chainId: string;
    productId: number;
  };
};

export const ScanResults = ({
  data: { chainId, productId },
}: ScanResultsProps) => {
  const renderDetail = (rowData: TimelineData) => {
    return (
      <View style={{ flex: 1 }}>
        <Text style={[styles.title]}>{rowData.title}</Text>
        <Text style={[styles.time]}>{rowData.subtitle}</Text>
      </View>
    );
  };

  const [timeline, setTimeline] = useState<TimelineData[]>([]);

  React.useEffect(() => {
    (async () => {
      const timeline = await getProductTimeLineForUser(chainId, productId);
      setTimeline(timeline);
    })();
  });

  return (
    <View style={styles.container}>
      <Timeline
        data={timeline.map(({ title, subtitle, success }: TimelineData) => ({
          subtitle,
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
    fontSize: 10,
    color: "#999",
  },
});
