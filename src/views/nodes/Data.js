import React from "react";
import * as d3 from "d3";
import styles from "./index.module.scss";

let data = {
  nodes: [],
  links: [],
};

for (let i = 0; i < 500; i++) {
  data.nodes.push({
    id: `${i}`,
    group: `abc`,
    radius: 5,
    citing_patents_count: i,
  });
}
for (let i = 0; i < 199; i++) {
  data.links.push({
    source: `${i}`,
    target: `${499}`,
    value: 2,
  });
}
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
    const width = 1800,
      height = 1000;
    const drag = (simulation) => {
      function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
      }

      function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }

      return d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    };

    const links = data.links.map((d) => Object.create(d));
    const nodes = data.nodes.map((d) => Object.create(d));

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3.forceLink(links).id((d) => d.id)
      )
      .force("charge", d3.forceManyBody())
      .force("x", d3.forceX())
      .force("y", d3.forceY());

    const svg = d3.select("#svg-id").attr("viewBox", [0, 0, width, height]);

    svg
      .insert("g")
      .attr("id", "box-svg-bg")
      .attr("fill", "url(#diagramPattern)")
      .append("rect")
      .attr("id", "box-svg-bg-id")
      .attr("width", width)
      .attr("height", height);

    const g = svg
      .append("g")
      .attr("cursor", "grab")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const link = g
      .append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", (d) => Math.sqrt(d.value));

    const node = g
      .append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("g")
      .data(nodes)
      .join("circle")
      .attr("r", 5)
      .attr("fill", "#08c")
      .call(drag(simulation))
      .call(
        d3
          .drag()
          .on("start", dragstarted)
          .on("drag", svgDragged)
          .on("end", dragended)
      );

    node.append("title").text((d) => {
      return d.index;
    });

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    });
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
      <div className={styles.dataWrap}>
        <div>
          <svg id="svg-id"></svg>
        </div>
      </div>
    );
  }
}

export default App;
