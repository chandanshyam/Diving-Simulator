import { Chart } from "react-google-charts";
import useDivingStore from "../../store/divingStore.js";
import GaugeWrapper from "./GaugeWrapper.js";

const UmbilicalPressure = ({ title = "Umbilical Pressure" }) => {
  const umbilicalPressure = useDivingStore((state) => state.umbilicalPressure);

  return (
    <GaugeWrapper
      currentValue={umbilicalPressure}
      safeRangeMin={7}
      safeRangeMax={20}
      minValue={0}
      maxValue={30}
      unit="bars"
      showLabels={true}
    >
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
          // Safe range: 7-20 bars (green). Below 7 is red, above 20 is yellow/warning
          redFrom: 0,
          redTo: 7,
          greenFrom: 7,
          greenTo: 20,
          yellowFrom: 20,
          yellowTo: 30,
          minorTicks: 5,
          min: 0,
          max: 30,
          animation: {
            duration: 400,
            easing: 'inAndOut'
          },
          backgroundColor: 'transparent'
        }}
      />
    </GaugeWrapper>
  );
};

export default UmbilicalPressure;