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

const DiverDepth = ({ id, value, title }) => {
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
          redFrom: 200,
          redTo: 250,
          yellowFrom: 150,
          yellowTo: 200,
          greenFrom: 0,
          greenTo: 150,
          minorTicks: 10,
          min: 0,
          max: 250
        }}
      />
    </div>
  );
};

export default DiverDepth;
