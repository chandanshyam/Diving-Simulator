import { Chart } from "react-google-charts";
import useDivingStore from "../../store/divingStore.js";

const DiveTimeRemaining = ({ title = "Dive Time Remaining" }) => {
  const remainingDiveTime = useDivingStore((state) => state.remainingDiveTime);

  


  return (
    <>
      <div className="gauge-title">{title}</div>
      <Chart
        height={200}
        chartType="Gauge"
        loader={<div></div>}
        data={[
          ["Label", "Value"],
          ["", Number(remainingDiveTime ? remainingDiveTime.toFixed(1) : '0.0')]
        ]}
        options={{
          // Fixed color zones: Green > 20min, Orange 10-20min, Red < 10min
          greenFrom: 20,
          greenTo: 60,
          yellowFrom: 10,
          yellowTo: 20,
          redFrom: 0,
          redTo: 10,
          minorTicks: 5,
          min: 0,
          max: 60,
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

export default DiveTimeRemaining;