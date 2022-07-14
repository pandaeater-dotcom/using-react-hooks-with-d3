import React, { useRef, useEffect, useState } from "react";
import {
  select,
  drag,
  hierarchy,
  forceSimulation,
  forceLink,
  forceCenter,
  forceManyBody,
  pointer,
  forceX,
  forceY,
  forceCollide,
  forceRadial,
} from "d3";
import useResizeObserver from "./useResizeObserver";

const dragNode = (simulation) => {
  const dragstarted = (event) => {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  };

  const dragged = (event) => {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  };

  const dragended = (event) => {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  };

  return drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
};

const pickNodeRadius = (node) => {
  if (node.data.level === 0) return 15;
  else if (node.data.level === 1) return 10;
  else return 5;
};

const pickNodeColor = (node) => {
  const colorChart = {
    0: "#ab4444",
    1: "#99f6ff",
    2: "#ffad7d",
    3: "#8f8f8f",
    4: "#b8ff91",
    5: "#cc96ff",
    6: "#946666",
    7: "#ffabd9",
  };
  const nodeGroup = node.data.group;

  return colorChart[nodeGroup];
};

const pickLinkColor = (node) => {
  return pickNodeColor(node.target);
};

function ForceTreeChart({ nodeHoverTooltip, initData }) {
  const [data, setData] = useState({...initData});
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  const tooltip = document.querySelector("#graph-tooltip");
  if (!tooltip) {
    const tooltipDiv = document.createElement("div");
    tooltipDiv.classList.add("tooltip");
    tooltipDiv.style.opacity = "0";
    tooltipDiv.id = "graph-tooltip";
    document.body.appendChild(tooltipDiv);
  }

  const div = select("#graph-tooltip");
  useEffect(() => {
    if (!dimensions) return;
    const svg = select(svgRef.current);

    const addTooltip = (hoverTooltip, d, x, y) => {
      div.transition().duration(200).style("opacity", 0.9);
      div
        .html(hoverTooltip(d))
        .style("left", `${x}px`)
        .style("top", `${y - 28}px`);
    };

    const removeTooltip = () => {
      div.transition().duration(200).style("opacity", 0);
    };

    const nodeClickHandler = (node) => {
      console.log(data === initData)
      node = node.target.__data__.data;
      if (node.children) {
        node._children = node.children;
        node.children = null;
        setData({...initData});
      } else {
        node.children = node._children;
        node._children = null;
        setData({...initData});
      }
    };



    // centering workaround
    svg.attr("viewBox", [
      -dimensions.width / 2,
      -dimensions.height / 2,
      dimensions.width,
      dimensions.height,
    ]);

    // d3 util to work with hierarchical data
    const root = hierarchy(data);
    const nodeData = root.descendants();
    const linkData = root.links();

    const simulation = forceSimulation(nodeData)
      .force(
        "charge",
        forceManyBody().strength((d) => (4 - d.data.level) * -15)
      )
      .force("center", forceCenter().strength(1))
      .force("y", forceY())
      .force("x", forceX())
      .force("colide", forceCollide((d) => d.r * 4).iterations(3))
      .force(
        "link",
        forceLink(linkData)
          .id((d) => d.id)
          .strength(1)
      )
      .on("tick", () => {
        console.log("current force", simulation.alpha());

        // current alpha text
      });

    // const alpha = svg
    //   .selectAll(".alpha")
    //   .data([data])
    //   .join("text")
    //   .attr("class", "alpha")
    //   .text(simulation.alpha().toFixed(2))
    //   .attr("x", -dimensions.width / 2 + 10)
    //   .attr("y", -dimensions.height / 2 + 25);

    // links
    const link = svg
      .selectAll(".link")
      .data(linkData)
      .join("line")
      .attr("class", "link")
      .attr("stroke", (node) => pickLinkColor(node))
      .attr("fill", "none");

    // nodes
    const node = svg
      .selectAll(".node")
      .data(nodeData)
      .join("circle")
      .attr("class", "node")
      .attr("r", (node) => pickNodeRadius(node))
      .attr("fill", (node) => pickNodeColor(node))
      // .attr("stroke", "#000000")
      // .attr("stroke-width", 1)
      .on("click", nodeClickHandler)
      .call(dragNode(simulation));

    // labels
    // const label = svg
    // .selectAll(".label")
    // .data(nodeData)
    // .join("text")
    // .attr("class", "label")
    // // .attr("text-anchor", "middle")
    // .attr("font-size", 8)
    // .attr("dx", 15)
    // .attr("dy", 4)
    // .text((node) => node.data.name);
    // .attr("x", (node) => node.x)
    // .attr("y", (node) => node.y);

    simulation.on("tick", () => {
      //update link positions
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      // update node positions
      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

      node
        .on("mouseover", (d) => {
          addTooltip(nodeHoverTooltip, d, d.pageX, d.pageY);
        })
        .on("mouseout", () => {
          removeTooltip();
        });

      // update label positions
      // label
      //   .attr("x", (d) => {
      //     return d.x;
      //   })
      //   .attr("y", (d) => {
      //     return d.y;
      //   });
    });

    node.on("click", (node) => nodeClickHandler(node));

    // node.on('hover', (node) => nodeHoverHandler(node));

    // svg.on("mousemove", (event) => {
    //   const [x, y] = pointer(event);
    //   simulation
    //     .force(
    //       "x",
    //       forceX(x).strength(-0.01)
    //     )
    //     .force(
    //       "y",
    //       forceY(y).strength(-0.01)
    //     );
    // });

    // svg.on("click", (event) => {
    //   const [x, y] = pointer(event);
    //   simulation
    //     .alpha(0.5)
    //     .restart()
    //     .force("orbit", forceRadial(100, x, y).strength(0.8));

    return () => {
      console.log("shit");
    };
  }, [data, dimensions, nodeHoverTooltip, div, initData]);

  return (
    <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
      <svg ref={svgRef}></svg>
    </div>
  );
}

export default ForceTreeChart;
