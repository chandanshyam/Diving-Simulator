import { Chart } from "react-google-charts";
import useDivingStore from "../../store/divingStore.js";

const DiverDepth = ({ diverNumber, title }) => {
  const diver1Depth = useDivingStore((state) => state.diver1Depth);
  const diver2Depth = useDivingStore((state) => state.diver2Depth);
  // Get the appropriate diver depth based on diverNumber
  const depth = diverNumber === 1 ? diver1Depth : diver2Depth;
  const displayTitle = title || `Diver ${diverNumber} Depth`;

  return (
    <>
      <div className="gauge-title">{displayTitle}</div>
      <Chart
        height={200}
        chartType="Gauge"
        loader={<div></div>}
        data={[
          ["Label", "Value"],
          ["", Number(depth ? depth.toFixed(1) : '0.0')]
        ]}
        options={{
          // Updated color zones: green (0-20), orange (20-30), red (30-40)
          greenFrom: 0,
          greenTo: 20,
          yellowFrom: 20,
          yellowTo: 30,
          redFrom: 30,
          redTo: 40,
          minorTicks: 5,
          min: 0,
          max: 40,
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

export default DiverDepth;