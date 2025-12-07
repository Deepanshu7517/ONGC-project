import React from "react";
import { type SensorInfo } from "../types";
// import { getCardStatus } from "../utils/getCardStatus";
import "../css/global.css";
interface SensorCardProps {
  sensor: SensorInfo;
}

const SensorCard: React.FC<SensorCardProps> = ({ sensor }) => {
  // const { indicatorColor, message } = getCardStatus(sensor.measurement, sensor.unit);
if (sensor.sensor === "RTD-15") {
  return null; 
}
  return (
    <div className="sensor-card">
      {/* ✅ Indicator Ball */}
      {/* <div className={`indicator ${indicatorColor}`} /> */}

      <p className="sensor-name">
        {sensor.sensor === "RTD-13"
          ? "Metering skid line 1 flow"
          : sensor.sensor === "RTD-14"
          ? "Metering skid line 2 flow"
          : sensor.sensor}
      </p>
      <div className="measurement">
        <span className="value">{sensor.measurement.toFixed(2)}</span>
        <span className="unit">{sensor.unit}</span>
      </div>

      {/* {message && (
        <div className="warning">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.511a.75.75 0 011.486 0L14.73 11.2a.75.75 0 01-.664 1.155H5.934a.75.75 0 01-.664-1.155L8.257 3.511zM10 13a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
          {message}
        </div>
      )} */}
    </div>
  );
};

export default SensorCard;
