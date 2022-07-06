import React from "react";
import TreeChart from "./TreeChart";
import ForceTreeChart from "./ForceTreeChart";
import ForceGraph from './ForceGraph';
import * as d3 from "d3";
// import Video from "./Video";
import "./App.css";

const data = {
  name: "😐",
  children: [
    {
      name: "🙂",
      children: [
        {
          name: "😀",
        },
        {
          name: "😁",
        },
        {
          name: "🤣",
        },
      ],
    },
    {
      name: "😔",
    },
  ],
};

function App() {
  return (
    <React.Fragment>
      <h2>🪐 D3 Force Layout</h2>
      <ForceTreeChart data={data} />
      {/* <ForceGraph nodes={miserables.nodes} links={miserables.links}></ForceGraph> */}
    </React.Fragment>
  );
}

export default App;
