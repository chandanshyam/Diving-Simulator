import { Chart } from "react-google-charts";
import useDivingStore from "../../store/divingStore.js";
import GaugeWrapper from "./GaugeWrapper.js";

const CylinderPressure = ({ cylinderNumber, title }) => {
  const cylinder1Pressure = useDivingStore((state) => state.cylinder1Pressure);
  const cylinder2Pressure = useDivingStore((state) => state.cylinder2Pressure);
  // Get the appropriate cylinder pressure based on cylinderNumber
  const pressure = cylinderNumber === 1 ? cylinder1Pressure : cylinder2Pressure;
  const displayTitle = title || `Cylinder ${cylinderNumber} Pressure`;

  return (
    <GaugeWrapper
      currentValue={pressure}
      alertThreshold={20}
      minValue={0}
      maxValue={200}
      unit="bars"
      alertOnLow={true}
      showLabels={true}
    >
      <div className="gauge-title">{displayTitle}</div>
      <Chart
        height={200}
        chartType="Gauge"
        loader={<div></div>}
        data={[
          ["Label", "Value"],
          ["", Number(pressure ? pressure.toFixed(1) : '0.0')]
        ]}
        options={{
          // Updated color zones: green (140-200), orange (80-140), red (0-80)
          greenFrom: 140,
          greenTo: 200,
          yellowFrom: 80,
          yellowTo: 140,
          redFrom: 0,
          redTo: 80,
          minorTicks: 10,
          min: 0,
          max: 200,
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

export default CylinderPressure;