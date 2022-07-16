import React from "react";
import TreeChart from "./TreeChart";
import ForceTreeChart from "./ForceTreeChart";
import ChartLabels from "./ChartLabels";
import * as d3 from "d3";
// import Video from "./Video";
import "./App.css";
import Revaluing from "./revaluing.json";
import { hierarchy } from "d3";

function App() {
  // console.log(Revaluing)
  const nodeLabels = [];


  const getNodeLabels = (nodeLabelInfo) => {
    nodeLabels.length = 0
    nodeLabelInfo.forEach((node) =>
      nodeLabels.push(
        <text x={node.x} y={node.y} fontSize='15'>
          {node.name}
        </text>
      )
    );
    console.log(nodeLabels)
  };

  const nodeHoverTooltip = React.useCallback((node) => {
    return `<div>${node.target.__data__.data.name}</div>`;
  }, []);

  const updateGraph = (node) => {};

  return (
    <React.Fragment>
      <h2>🪐 D3 Force Layout</h2>
      <ForceTreeChart
        nodeHoverTooltip={nodeHoverTooltip}
        initData={Revaluing}
        passNodeLabels={getNodeLabels}
      />
      {/* {nodeLabels} */}
      <ChartLabels nodeLabels={nodeLabels} />
    </React.Fragment>
  );
}

export default App;
