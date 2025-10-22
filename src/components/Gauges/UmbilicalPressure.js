import { Chart } from "react-google-charts";
import useDivingStore from "../../store/divingStore.js";

const UmbilicalPressure = ({ title = "Umbilical Pressure" }) => {
  const umbilicalPressure = useDivingStore((state) => state.umbilicalPressure);


  return (
    <>
      <div className="gauge-title">{title}</div>
      <Chart
        height={200}
        chartType="Gauge"
        loader={<div></div>}
        data={[
          ["Label", "Value"],
          ["", Number(umbilicalPressure ? umbilicalPressure.toFixed(1) : '0.0')]
        ]}
        options={{
          // Updated color zones: green (0-20), orange (20-25), red (25-30)
          greenFrom: 0,
          greenTo: 20,
          yellowFrom: 20,
          yellowTo: 25,
          redFrom: 25,
          redTo: 30,
          minorTicks: 5,
          min: 0,
          max: 30,
          animation: {
            duration: 500,
            easing: 'out'
          },
          backgroundColor: 'transparent'
        }}
      />
    </>
  );
};

export default UmbilicalPressure;