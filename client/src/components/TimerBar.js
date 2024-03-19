import React from "react";

const TimerBar = ({ width, height, percentage }) => {
  const fillWidth = (percentage / 100) * width;

  return (
    <svg width={width} height={height}>
      <rect x="0" y="0" width={width} height={height} fill="#280f73" />
      <rect
        x="0"
        y="0"
        width={fillWidth}
        height={height}
        fill="#aa65ff"
        style={{ transition: "width 60ms linear" }}
      />
    </svg>
  );
};

export default TimerBar;
