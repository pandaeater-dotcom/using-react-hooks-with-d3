import React from "react";
import TreeChart from "./TreeChart";
import ForceTreeChart from "./ForceTreeChart";
import * as d3 from "d3";
// import Video from "./Video";
import "./App.css";
import Revaluing from './revaluing.json';

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
  console.log(Revaluing)
  return (
    <React.Fragment>
      <h2>🪐 D3 Force Layout</h2>
      <ForceTreeChart data={Revaluing} />
      {/* <ForceGraph nodes={miserables.nodes} links={miserables.links}></ForceGraph> */}
    </React.Fragment>
  );
}

export default App;
