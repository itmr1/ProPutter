import React from 'react';
import { PieChart } from "react-minimal-pie-chart";

export const PieChart = () => {
  const data = [
    { title: "One", value: 1, color: "#FFC074" },
    { title: "Two", value: 2, color: "#A2D2FF" },
    { title: "Three", value: 3, color: "#FF9292" },
  ];
  return (
    <div style={{backgroundColor:"#DAE5D0"}} className="App">
      <PieChart
        animate
        animationDuration={40}
        animationEasing="ease-in"
        center={[50, 50]}
        data={data}
        lineWidth={15}
        lengthAngle={360}
        paddingAngle={0}
        radius={50}
        rounded
        startAngle={0}
        viewBoxSize={[100, 100]}
        labelStyle={{
          fontSize: "6px",
          fontColor: "FFFFFA",
          fontWeight: "500",
          fontFamily: "monospace"
        }}
        label={(data) => data.dataEntry.title}
        labelPosition={70}
      />
    </div>
  );
}
