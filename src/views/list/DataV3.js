import React from "react";
import * as d3 from "d3";
import "./Index.scss";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
  }
  componentDidMount() {
    this.draw();
  }

  draw() {
    const width = window.screen.width;
    const height = window.screen.height;

    const graph = {
      nodes: Array.from({ length: 50 }, () => ({})),
      links: [
        { source: 0, target: 1 },
        { source: 1, target: 2 },
        { source: 2, target: 0 },
        { source: 1, target: 3 },
        { source: 3, target: 2 },
        { source: 3, target: 4 },
        { source: 4, target: 5 },
        { source: 5, target: 6 },
        { source: 5, target: 7 },
        { source: 6, target: 7 },
        { source: 6, target: 8 },
        { source: 7, target: 8 },
        { source: 9, target: 4 },
        { source: 9, target: 11 },
        { source: 9, target: 10 },
        { source: 10, target: 11 },
        { source: 11, target: 12 },
        { source: 12, target: 10 },
      ],
    };

    function clamp(x, lo, hi) {
      return x < lo ? lo : x > hi ? hi : x;
    }

    const svg = d3.select("#svg-id").attr("viewBox", [0, 0, width, height]);
    svg
      .insert("g")
      .attr("id", "box-svg-bg")
      .attr("fill", "url(#diagramPattern)")
      .append("rect")
      .attr("id", "box-svg-bg-id")
      .attr("width", width)
      .attr("height", height);
    const g = svg.append("g").attr("cursor", "grab");
    const link = g
      .selectAll(".link")
      .data(graph.links)
      .join("line")
      .classed("link", true);
    const node = g
      .selectAll(".node")
      .data(graph.nodes)
      .join("circle")
      .attr("r", 12)
      .classed("node", true)
      .classed("fixed", (d) => d.fx !== undefined)
      .call(
        d3
          .drag()
          .on("start", dragstarted)
          .on("drag", svgDragged)
          .on("end", dragended)
      );

    svg.node();

    const simulation = d3
      .forceSimulation()
      .nodes(graph.nodes)
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("link", d3.forceLink(graph.links))
      .on("tick", tick);

    const drag = d3.drag().on("start", dragstart).on("drag", dragged);

    node.call(drag).on("click", click);

    function tick() {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);
      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    }

    function click(event, d) {
      delete d.fx;
      delete d.fy;
      d3.select(this).classed("fixed", false);
      simulation.alpha(1).restart();
    }

    function dragstart() {
      d3.select(this).classed("fixed", true);
    }

    function dragged(event, d) {
      d.fx = clamp(event.x, 0, width);
      d.fy = clamp(event.y, 0, height);
      simulation.alpha(1).restart();
    }

    svg.call(
      d3
        .zoom()
        .extent([
          [0, 0],
          [width, height],
        ])
        .scaleExtent([1, 8])
        .on("zoom", zoomed)
    );

    function dragstarted() {
      d3.select(this).raise();
      g.attr("cursor", "grabbing");
    }

    function svgDragged(event, d) {
      d3.select(this)
        .attr("cx", (d.x = event.x))
        .attr("cy", (d.y = event.y));
    }

    function dragended() {
      g.attr("cursor", "grab");
    }

    function zoomed({ transform }) {
      g.attr("transform", transform);
    }

    /* 网格 */
    let outerDefs = svg.append("defs");
    const gridArr = new Array(20);
    this.bgRegion = outerDefs
      .append("pattern")
      .attr("id", "diagramPattern")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 100)
      .attr("height", 100)
      .attr("patternUnits", "userSpaceOnUse");
    this.bgRegion
      .selectAll("path")
      .data(gridArr)
      .enter()
      .append("path")
      .attr("stroke", "#e0e0e0")
      .attr("stroke-width", "0.25")
      .attr("dashArray", "")
      .attr("d", (d, index) => {
        if (index === 0) {
          return `M0,0.5 L100,0.5 Z`;
        } else if (index < 10 && index > 0) {
          return `M0,${index * 10}.125 L100,${index * 10}.125 Z`;
        } else if (index === 10) {
          return `M0.5,0 L0.5,100 Z`;
        } else if (index > 10) {
          return `M${(index - 10) * 10}.125,0 L${(index - 10) * 10}.125,100 Z`;
        }
      });
  }

  render() {
    return (
      <div className="data-wrap">
        <div>
          <svg id="svg-id"></svg>
        </div>
      </div>
    );
  }
}

export default App;
