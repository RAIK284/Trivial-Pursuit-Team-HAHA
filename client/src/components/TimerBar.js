import React from "react";

const TimerBar = ({ width, height, percentage }) => {
  const fillWidth = (percentage / 100) * width - 50;

  return (
    <svg width="100%" height={height}>
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
