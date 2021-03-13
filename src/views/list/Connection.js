import React, { Component } from "react";
import * as d3 from "d3";
import EventEmitter from "utils/events";
import { uuid } from "utils/uuid";
import { resize } from "utils/resize";
import { getBodySize } from "utils/getBodySize";
import "./connection.scss";

const width = window.screen.width;
const height = window.screen.height - 150;

const items = [
  {
    id: uuid(16, 16),
    type: "table", //表，过滤组件，关联组件，透视组件，目标表
    width: 60,
    height: 60,
    x: width / 4,
    y: height / 2,
    circleRadius: 5,
    title: uuid(7, 16),
    index: 0,
    fixed: false,
  },
  {
    id: uuid(16, 16),
    type: "table", //表，过滤组件，关联组件，透视组件，目标表
    width: 60,
    height: 60,
    x: width / 2,
    y: height / 2,
    circleRadius: 5,
    title: uuid(7, 16),
    index: 1,
    fixed: false,
  },
  {
    id: uuid(16, 16),
    type: "table", //表，过滤组件，关联组件，透视组件，目标表
    width: 60,
    height: 60,
    x: width / 2,
    y: height / 2 + 60 * 2,
    circleRadius: 5,
    title: uuid(7, 16),
    index: 1,
    fixed: false,
  },
  {
    id: uuid(16, 16),
    type: "table", //表，过滤组件，关联组件，透视组件，目标表
    width: 60,
    height: 60,
    x: width / 2,
    y: height / 2 + 60 * 4,
    circleRadius: 5,
    title: uuid(7, 16),
    index: 1,
    fixed: false,
  },
  {
    id: uuid(16, 16),
    type: "table", //表，过滤组件，关联组件，透视组件，目标表
    width: 60,
    height: 60,
    x: width / 2,
    y: height / 2 - 60 * 4,
    circleRadius: 5,
    title: uuid(7, 16),
    index: 1,
    fixed: false,
  },
  {
    id: uuid(16, 16),
    type: "table", //表，过滤组件，关联组件，透视组件，目标表
    width: 60,
    height: 60,
    x: width / 2,
    y: height / 2 - 60 * 2,
    circleRadius: 5,
    title: uuid(7, 16),
    index: 1,
    fixed: false,
  },
];
class GenerateDiagram extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: window.screen.width,
      height: window.screen.height,
      tableWidth: 60, //组件宽度
      tableHeight: 60, //组件高度
      circleRadius: 5, //小圆半径
      items: [], //组件列表
      connectRalation: [], //连线关系
    };
    this.addTableCt = this.addTableCt.bind(this);
    this.sortByClick = this.sortByClick.bind(this);
  }
  componentDidMount() {
    this.draw();
  }

  draw() {
    const item0 = items[0];
    const item1 = items[1];
    this.setState({
      items: items,
    });

    let $this = this;
    /* 注册resize */
    EventEmitter.off("resizeSvg");
    EventEmitter.on("resizeSvg", function (data) {
      $this.setState({
        height: data.height,
      });
      d3.select("#box-svg-bg-id")
        .attr("height", data.height)
        .attr("width", data.width);
    });
    this.outerSvgRegion = d3
      .select("#model-svg-id")
      .attr("viewBox", [0, 0, this.state.width, this.state.height]);

    this.outerSvgRegion
      .insert("g")
      .attr("id", "box-svg-bg")
      .attr("fill", "url(#diagramPattern)")
      .append("rect")
      .attr("id", "box-svg-bg-id")
      .attr("width", this.state.width)
      .attr("height", this.state.height);

    this.outerRegionWrap = this.outerSvgRegion
      .append("g")
      .attr("id", "box-svg-id");
    this.outerRegionWrap
      .append("rect")
      .attr("width", this.state.width)
      .attr("height", this.state.height)
      .attr("class", "rectTable")
      .call(d3.zoom().scaleExtent([0.1, 100]).on("zoom", svgZoomed));
    this.outerPathAndNodes = this.outerRegionWrap.append("g");
    /* 所有连接线区域 */
    this.outerAllPathRegion = this.outerPathAndNodes.append("g");
    renderLines({
      region: this.outerAllPathRegion,
      relation: [
        {
          x1: item0.x + 60,
          y1: item0.y + 60 / 2,
          x2: item1.x,
          y2: item1.y + 60 / 2,
          startId: item0.id,
          startCircleIndex: 0,
          endId: item1.id,
          endCircleIndex: 1,
        },
      ],
    });
    /* 组件节点 */
    this.outerRegion = this.outerPathAndNodes.append("g");
    let $outerRegion = this.outerPathAndNodes;
    /*** 绘制箭头 ***/
    let outerDefs = this.outerSvgRegion.append("defs");
    outerDefs
      .append("marker")
      .attr("id", "arrowEnd")
      .attr("markerUnits", "strokeWidth")
      .attr("markerWidth", "12")
      .attr("markerHeight", "12")
      .attr("viewBox", "0 0 12 12")
      .attr("refX", "10")
      .attr("refY", "6")
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M2,2 L10,6 L2,10 L6,6 L2,2")
      .attr("name", "pathArrow")
      .attr("class", "pathArrow");
    outerDefs
      .append("marker")
      .attr("id", "arrowStart")
      .attr("markerUnits", "strokeWidth")
      .attr("markerWidth", "12")
      .attr("markerHeight", "12")
      .attr("viewBox", "0 0 12 12")
      .attr("refX", "0")
      .attr("refY", "6")
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M10,2 L2,6 L10,10 L6,6 L10,2")
      .attr("name", "pathArrow")
      .attr("class", "pathArrow");
    /* 网格 */
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
    /* 动态连接线 */
    this.outerRegion
      .append("path")
      .attr("class", "unrestrainedPath")
      .attr("id", "unrestrainedPathId")
      .attr("name", "unrestrainedPath")
      .attr("marker-end", "url(#arrowEnd)")
      .attr("marker-start", "url(#arrowStart)")
      .attr("d", "M0,0 0,0");
    /*** 固定组件 ***/
    this.outerFixRegion = this.outerRegion
      .data([{ x: 0, y: 0 }])
      .append("g")
      .attr("id", "fixedTableRegion")
      .call(
        d3
          .drag()
          .on("start", this.fixedTableStarted)
          .on("drag", this.fixedTableDragIng)
          .on("end", this.fixedTableDragEnd)
      );
    /*** 放大缩小 ***/
    function svgZoomed(event, d) {
      $outerRegion.attr("transform", event.transform);
    }
    this.updateTableList();
  }

  componentDidUpdate() {
    this.updateTableList();
  }
  componentWillUnmount() {}
  updateTableList() {
    if (this.state.items.length > 0) {
      this.outerRegion.selectAll("g.tableComponet").remove();
      let $notFixedItem = this.state.items.filter(
        (item) => item.fixed !== true
      );
      if ($notFixedItem.length > 0) {
        this.outerTableRegion = this.outerRegion
          .selectAll("g.tableRegion")
          .data($notFixedItem)
          .enter()
          .append("g")
          .attr("data-id", (d) => d.id)
          .attr("data-index", (d) => d.index)
          .attr("data-x", (d) => d.x)
          .attr("data-y", (d) => d.y)
          .attr("data-table-width", (d) => d.width)
          .attr("data-table-height", (d) => d.height)
          .attr("class", "tableComponet tableRegion")
          .attr("transform", (d) => `translate(${d.x}, ${d.y})`)
          .on("click", (d) => {
            this.sortByClick(d.index);
          })
          .call(
            d3
              .drag()
              .on("start", this.tableStarted)
              .on("drag", this.tableDragIng)
              .on("end", this.tableDragEnd)
          );
        this.outerTableRegion
          .append("rect")
          .attr("class", "tableRect")
          .attr("rx", "30") //圆角
          .attr("ry", "30")
          .attr("width", (d) => d.width)
          .attr("height", (d) => d.height);
        this.outerTableRegion
          .append("text")
          .attr("y", this.state.tableHeight + 20)
          .attr("x", (d) => d.width / 2)
          .text((d) => d.title);
        /*** 可连接点 ***/
        let $this = this;
        renderSmallNode({
          region: this.outerTableRegion,
          pathRegion: this.outerAllPathRegion,
          connectRelation: this.state.connectRalation,
          width: this.state.tableWidth,
          height: this.state.tableHeight,
          radius: this.state.circleRadius,
          setState: function (connectRalation) {
            $this.setState({
              connectRalation: connectRalation,
            });
          },
        });
      }
      /*** 固定组件 ***/
      let $fixedItem = this.state.items.filter((item) => item.fixed === true);
      const $tableHeight = this.state.tableHeight;
      $fixedItem.map(function (obj, $index, arr) {
        obj.x = 50;
        obj.y = $index * ($tableHeight + 30) + 50;
        obj.index = $index;
        return obj;
      });
      if ($fixedItem.length > 0) {
        this.outerFixedTableRegion = this.outerFixRegion
          .selectAll("g.tableFixedRegion")
          .data($fixedItem)
          .enter()
          .append("g")
          .attr("data-id", (d) => d.id)
          .attr("data-index", (d) => d.index)
          .attr("data-x", (d) => d.x)
          .attr("data-y", (d) => d.y)
          .attr("class", "tableComponet tableFixedRegion")
          .attr("transform", (d) => `translate(${d.x}, ${d.y})`);
        this.outerFixedTableRegion
          .append("rect")
          .attr("class", "tableRect")
          .attr("rx", "5") //圆角
          .attr("ry", "5")
          .attr("width", (d) => d.width)
          .attr("height", (d) => d.height);
        this.outerFixedTableRegion
          .append("text")
          .attr("y", this.state.tableHeight + 20)
          .attr("x", 0)
          .text((d) => d.title);
        /*** 固定连接线 ***/
        this.outerFixedTableRegion
          .append("path")
          .attr("name", "path")
          .attr("class", "linkConnect")
          .attr("d", (d) => {
            let $str = "";
            const x1 = this.state.tableWidth;
            const y1 = this.state.tableHeight / 2;
            const x2 = this.state.tableWidth + 200;
            const y2 = this.state.tableHeight / 2;
            if ($fixedItem.length > 1 && d.index === 0) {
              $str = `M${x1},${y1} ${x2},${y2} ${x2},${
                y2 + (--$fixedItem.length * ($tableHeight + 30) + 1)
              }`;
            } else {
              $str = `M${x1},${y1} ${x2},${y2}`;
            }
            return $str;
          });
      }
    }
  }
  tableStarted(event, d) {
    if (typeof d === "object") {
      d.dx = event.x;
      d.dy = event.y;
    }
  }
  tableDragIng(event, d) {
    if (typeof d === "object") {
      d.xp = d.x - (d.dx - event.x);
      d.yp = d.y - (d.dy - event.y);
      d3.select(this)
        .attr("transform", (d) => `translate(${d.xp}, ${d.yp})`)
        .attr("data-x", d.xp)
        .attr("data-y", d.yp);
      let $start = document.querySelectorAll(`.start-${d.id}`);
      let $end = document.querySelectorAll(`.end-${d.id}`);
      let $thisData = this.dataset;
      let $element;
      //let [$x,$y]         = [d.xp + $thisData.tableWidth/2,d.yp + $thisData.tableHeight/2];
      let [$x, $y] = [0, 0];
      let [$startCircleIndex, $endCircleIndex] = [];
      if ($start) {
        for (let [key, element] of $start.entries()) {
          [$x, $y] = [d.xp, d.yp];
          $element = element.dataset;
          $startCircleIndex = $element.startCircleIndex;
          [$x, $y] = getCoordsByIndex($x, $y, $startCircleIndex, $thisData);
          element.setAttribute(
            "d",
            `M${$x},${$y} ${$element.x2},${$element.y2}`
          );
          element.setAttribute("data-x1", $x);
          element.setAttribute("data-y1", $y);
          element.setAttribute("key", key);
        }
      }
      if ($end) {
        for (let [key, element] of $end.entries()) {
          [$x, $y] = [d.xp, d.yp];
          $element = element.dataset;
          $endCircleIndex = $element.endCircleIndex;
          [$x, $y] = getCoordsByIndex($x, $y, $endCircleIndex, $thisData);
          element.setAttribute(
            "d",
            `M${$element.x1},${$element.y1} ${$x},${$y}`
          );
          element.setAttribute("data-x2", $x);
          element.setAttribute("data-y2", $y);
          element.setAttribute("key", key);
        }
      }
    }
  }
  tableDragEnd(event, d) {
    if (d.xp) {
      d.x = d.xp;
      d.y = d.yp;
    }
  }
  fixedTableStarted(event, d) {
    d.dx = event.x;
    d.dy = event.y;
  }
  fixedTableDragIng(event, d) {
    let $this = this;
    d.xp = d.x - (d.dx - event.x);
    d.yp = d.y - (d.dy - event.y);
    d3.select($this)
      .attr("transform", (d) => `translate(${d.xp}, ${d.yp})`)
      .attr("data-x", d.xp)
      .attr("data-y", d.yp);
  }
  fixedTableDragEnd(event, d) {
    d.x = d.xp;
    d.y = d.yp;
  }
  /* 点击浮于最上层 */
  sortByClick(index) {
    if (this.state.items.length > 1) {
      let timer;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        let $del = this.state.items.splice(index, 1);
        let $arr = this.state.items
          .concat($del)
          .map(function (obj, $index, arr) {
            obj.index = $index;
            return obj;
          });
        this.setState((state) => ({
          items: $arr,
        }));
      }, 100);
    }
  }
  addTableCt() {
    const newItem = {
      id: uuid(16, 16),
      type: "table", //表，过滤组件，关联组件，透视组件，目标表
      width: this.state.tableWidth,
      height: this.state.tableHeight,
      x: Math.random() * this.state.width,
      y: Math.random() * this.state.height,
      circleRadius: this.state.circleRadius,
      title: uuid(7, 16),
      index: this.state.items.length,
      fixed: false, //Math.random()*1e3 > 500
    };
    this.setState((state) => ({
      items: state.items.concat(newItem),
    }));
  }
  visitChild = (ref) => {
    this.child = ref;
  };
  render() {
    return (
      <div className="connectionWrap">
        <div className="model-svg-wrap">
          <svg className="model-svg" id="model-svg-id"></svg>
        </div>
        <button
          type="submit"
          onClick={this.addTableCt}
          style={{
            height: "36px",
            margin: "5px 0 0 0",
            padding: "6px 12px",
            fontSize: "14px",
            borderRadius: "5px",
            background: "#111",
            border: "1px solid #111",
            color: "#fff",
            cursor: "pointer",
            width: "300px",
          }}
        >
          Add
        </button>
      </div>
    );
  }
}
/* 根据小圆点坐标计算连线坐标 */
function getCoordsByIndex(x, y, $index, $data) {
  switch ($index) {
    case "0":
      x += Number($data.tableWidth, 10) / 2;
      break;
    case "1":
      x += Number($data.tableWidth, 10);
      y += Number($data.tableHeight, 10) / 2;
      break;
    case "2":
      x += Number($data.tableWidth, 10) / 2;
      y += Number($data.tableHeight, 10);
      break;
    case "3":
      y += Number($data.tableHeight, 10) / 2;
      break;
    default:
  }
  return [x, y];
}
/* 渲染所有连线 */
function renderLines(params) {
  params.region
    .selectAll("path")
    .data(params.relation)
    .enter()
    .append("path")
    .attr("name", "path")
    .attr("class", (d) => {
      return `nodeConnect start-${d.startId} end-${d.endId}`;
    })
    .attr("d", (d) => {
      //const $a = (Number.parseFloat(d.x2,10)-Number.parseFloat(d.x1,10))/2+Number.parseFloat(d.x1,10);
      return `M${d.x1},${d.y1} L${d.x2},${d.y2}`;
    })
    .attr("data-x1", (d) => d.x1)
    .attr("data-y1", (d) => d.y1)
    .attr("data-x2", (d) => d.x2)
    .attr("data-y2", (d) => d.y2)
    .attr("data-start", (d) => d.startId)
    .attr("data-end", (d) => d.endId)
    .attr("data-start-circle-index", (d) => d.startCircleIndex)
    .attr("data-end-circle-index", (d) => d.endCircleIndex)
    .attr("marker-end", "url(#arrowEnd)")
    .attr("marker-start", "url(#arrowStart)");
}
/* 渲染可连接点 */
function renderSmallNode(params) {
  function pathStarted(event, d) {
    if (typeof d === "object") {
      d.dx = event.x;
      d.dy = event.y;
      d.parentId = this.parentNode.dataset.id;
      d.startCircleIndex = this.dataset.index;
    }
  }
  function pathDragIng(event, d) {
    if (typeof d === "object") {
      let $parent = this.parentNode;
      const xDis = Number.parseFloat($parent.getAttribute("data-x"));
      const yDis = Number.parseFloat($parent.getAttribute("data-y"));
      const x1 = d.x + xDis;
      const y1 = d.y + yDis;
      const x2 = event.x + xDis;
      const y2 = event.y + yDis;
      let $dom = document.getElementById("unrestrainedPathId");
      $dom.setAttribute("d", `M${x1},${y1} ${x2},${y2}`);
      $dom.setAttribute("data-x1", x1);
      $dom.setAttribute("data-y1", y1);
      $dom.setAttribute("data-x2", x2);
      $dom.setAttribute("data-y2", y2);
      $dom.setAttribute("class", "unrestrainedPath active");
    }
  }
  function pathDragEnd(event, d) {
    const $dom = document.getElementById("unrestrainedPathId");
    const $active = document.querySelector(".tableCircle.active");
    if ($active) {
      const $data = $dom.dataset;
      params.connectRelation = params.connectRelation.concat({
        x1: $data.x1,
        y1: $data.y1,
        x2: $data.x2,
        y2: $data.y2,
        startId: d.parentId,
        startCircleIndex: d.startCircleIndex,
        endId: $active.parentNode.dataset.id,
        endCircleIndex: $active.dataset.index,
      });
      params.setState(params.connectRelation);
      renderLines({
        region: params.pathRegion,
        relation: params.connectRelation,
      });
    }
    $dom.setAttribute("d", "M0,0 0,0");
    $dom.setAttribute("class", "unrestrainedPath");
  }
  params.region
    .selectAll("circle")
    .data([
      {
        x: params.width / 2,
        y: 0,
      },
      {
        x: params.width,
        y: params.height / 2,
      },
      {
        x: params.width / 2,
        y: params.height,
      },
      {
        x: 0,
        y: params.height / 2,
      },
    ])
    .enter()
    .append("circle")
    .attr("class", "tableCircle")
    .attr("data-index", (d, i) => {
      return i;
    })
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y)
    .attr("r", params.radius)
    .on("mouseenter", function (d) {
      d3.select(this).classed("tableCircle active", true);
    })
    .on("mouseleave", function (d) {
      this.setAttribute("class", "tableCircle");
    })
    .call(
      d3
        .drag()
        .on("start", pathStarted)
        .on("drag", pathDragIng)
        .on("end", pathDragEnd)
    );
}

resize(function () {
  //重置窗口大小时
  const $size = getBodySize();
  EventEmitter.trigger("resizeSvg", {
    height: $size.height - 178,
    width: $size.width - 70,
  });
});

export default GenerateDiagram;
