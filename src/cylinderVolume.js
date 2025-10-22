import React from "react";
import { Chart } from "react-google-charts";

const styles = {
  dial: {
    width: `auto`,
    height: `auto`,
    color: "#000",
    border: "0.5px solid #fff",
    padding: "2px"
  },
  title: {
    fontSize: "1em",
    color: "#000"
  }
};

const CylinderVolume = ({ id, value, title }) => {
  return (
    <div style={styles.dial}>
      <Chart
        height={200}
        chartType="Gauge"
        loader={<div></div>}
        data={[
          ["Label", "Value"],
          ["", Number(value)]
        ]}
        options={{
          redFrom: 80,
          redTo: 100,
          yellowFrom: 60,
          yellowTo: 80,
          greenFrom: 0,
          greenTo: 60,
          minorTicks: 5,
          min: 0,
          max: 100
        }}
      />
    </div>
  );
};

export default CylinderVolume;
