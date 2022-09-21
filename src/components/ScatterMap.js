import React, { useEffect } from "react";
import * as d3 from "d3";
import { geoAlbersUsa, geoPath } from "d3-geo";
import { scaleLinear, scaleSequential } from "d3-scale";
import { feature } from "topojson-client";
var projection;
var dataset_,
  dataset,
  extremeVals,
  colorList,
  normalizeAttr,
  colorLevelMap,
  attr;
const CONTINUOUS_COLOR_LIST = ["#d0efff", "#03254c"];
const PARTY_COLOR_LIST = ["#cc0000", "#0000cc"];
const PARTY_TEXT_LIST = ["Republican", "Democrat"];
const BALLOT_COLOR_LIST = [
  "#FFB90F",
  "#FF6A6A",
  "#0000FF",
  "#CD0000",
  "#828282",
];
const BALLOT_TEXT_LIST = [
  "Absentee",
  "Early",
  "Poll Vote",
  "Provisional",
  "No Vote",
];
const OPACITY = 0.7;
const LEGEND_FONT_SIZE = 10;
const LEGEND_HEIGHT = 20;
const LEGEND_DISCRETE_WIDTH = 20;
const LEGEND_DISCRETE_DISTANCE = 60;
const LEGEND_LINEAR_WIDTH = 200;

const ScatterMap = ({ ethnicFilter, attrFilter }) => {
  // load the original dataset and draw the background map at the beginning
  useEffect(() => {
    async function mount() {
      dataset_ = await d3.csv("scatter_map_dataset.csv"); // 之后要从组件外载入
      drawBgMap();
    }
    mount();
  }, []);
  // attribute filter change, redraw the legend and maybe redraw the scatter
  useEffect(() => {
    async function processNewScale() {
      extremeVals = d3.extent(dataset.map((ele) => Number(ele[attr])));
      normalizeAttr = d3
        .scaleLinear()
        .domain([extremeVals[0], extremeVals[1]])
        .range([0, 1]);
    }
    if (dataset_ && attrFilter && attrFilter.length > 0) {
      d3.select("#scatter-map").selectAll("svg > circle").remove();
      d3.select("#scatter-legend").selectAll("*").remove();
      attr = attrFilter;
      dataset = dataset_.filter((ele) => ele[attr] && ele.long && ele.lat);

      if (attr === "impute_party") {
        // categorical var
        colorList = PARTY_COLOR_LIST;
        extremeVals = PARTY_TEXT_LIST;
        colorLevelMap = {};
        extremeVals.forEach((ele, idx) => {
          colorLevelMap[ele] = colorList[idx];
        });
        drawCategoricalLegendScale();
      } else if (attr === "edu_level") {
        // nominal var
        colorList = CONTINUOUS_COLOR_LIST;
        colorLevelMap = d3.interpolateRgb(
          d3.rgb(colorList[0]),
          d3.rgb(colorList[colorList.length - 1])
        );
        processNewScale();
        drawNominalLegendScale();
      } else if (attr.indexOf("BallotType") > -1) {
        // categorical var
        colorList = BALLOT_COLOR_LIST;
        extremeVals = BALLOT_TEXT_LIST;
        colorLevelMap = {};
        extremeVals.forEach((ele, idx) => {
          colorLevelMap[ele] = colorList[idx];
        });
        drawCategoricalLegendScale();
      } else {
        // others: all continuous var
        colorList = CONTINUOUS_COLOR_LIST;
        colorLevelMap = d3.interpolateRgb(
          d3.rgb(colorList[0]),
          d3.rgb(colorList[colorList.length - 1])
        );
        processNewScale();
        drawContinuousLegendScale();
      }

      if (ethnicFilter && ethnicFilter.length > 0) {
        drawDots(ethnicFilter);
      }
    }
  }, [attrFilter]);
  // ethnic filter change, clean the map and maybe draw the scatter
  useEffect(() => {
    if (!attr) {
      return;
    }
    if (ethnicFilter.length > 0) {
      d3.select("#scatter-map").selectAll("svg > circle").remove();
      drawDots(ethnicFilter);
    } else {
      d3.select("#scatter-map").selectAll("svg > circle").remove();
    }
  }, [ethnicFilter]);
  return (
    <div id="map-outer" style={{ width: "100%", textAlign: "center" }}>
      <svg id="scatter-map"></svg>
      <svg id="scatter-legend"></svg>
    </div>
  );
};

const drawBgMap = () => {
  var width = document.getElementById("map-outer").offsetWidth
  var height = width / 10 * 8
  projection = geoAlbersUsa()
    .translate([width / 2, height / 2])
    .scale([width*1.2]);
  var path = geoPath().projection(projection);
  var svg = d3.select("#scatter-map").attr("width", width).attr("height", height);
  d3.select("#area-legend").attr("width", width).attr("height", LEGEND_HEIGHT);
  d3.json("map-data.json").then((data) => {
    svg
      .selectAll("path")
      .data(feature(data, data.objects.states).features)
      .enter()
      .append("path")
      .attr("d", path)
      .style("stroke", "white")
      .style("stroke-width", "1")
      .style("fill", "rgb(240, 242, 241)");
  });
};

const drawDots = (ethnicFilter) => {
  d3.select("#scatter-map")
    .selectAll("circle")
    .data(dataset.filter((ele) => ethnicFilter.indexOf(ele.race) > -1))
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return projection([d.long, d.lat])[0];
    })
    .attr("cy", function (d) {
      return projection([d.long, d.lat])[1];
    })
    .attr("r", function (d) {
      return 1.5;
    })
    .style("opacity", OPACITY)
    .style("fill", function (d) {
      if (attr === "impute_party" || attr.indexOf("BallotType") > -1) {
        return colorLevelMap[d[attr]];
      } else {
        return colorLevelMap(normalizeAttr(d[attr]));
      }
    });
};

const drawCategoricalLegendScale = () => {
  d3.select("#scatter-legend")
    .selectAll("rect")
    .data(colorList)
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * LEGEND_DISCRETE_DISTANCE)
    .attr("y", 0)
    .attr("height", LEGEND_HEIGHT)
    .attr("width", LEGEND_DISCRETE_WIDTH)
    .style("opacity", OPACITY)
    .attr("fill", (d) => d);

  d3.select("#scatter-legend")
    .selectAll("txt")
    .data(extremeVals)
    .enter()
    .append("text")
    .text((d) => d)
    .attr("x", (d, i) => i * LEGEND_DISCRETE_DISTANCE)
    .attr("font-size", LEGEND_FONT_SIZE)
    .attr("y", LEGEND_HEIGHT + LEGEND_FONT_SIZE * 1.5);
};

const drawNominalLegendScale = () => {
  const nominalValArr = [
    ...Array(extremeVals[extremeVals.length - 1] + 1).keys(),
  ].slice(extremeVals[0]);

  d3.select("#scatter-legend")
    .selectAll("rect")
    .data(nominalValArr)
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * LEGEND_DISCRETE_DISTANCE)
    .attr("y", 0)
    .attr("height", LEGEND_HEIGHT)
    .attr("width", LEGEND_DISCRETE_WIDTH)
    .style("opacity", OPACITY)
    .attr("fill", (d) => {
      return colorLevelMap(normalizeAttr(d));
    });

  d3.select("#scatter-legend")
    .selectAll("txt")
    .data(nominalValArr)
    .enter()
    .append("text")
    .text((d) => d.toFixed(1))
    .attr("x", (d, i) => i * LEGEND_DISCRETE_DISTANCE)
    .attr("font-size", LEGEND_FONT_SIZE)
    .attr("y", LEGEND_HEIGHT + LEGEND_FONT_SIZE * 1.5);
};

const drawContinuousLegendScale = () => {
  const continuousValArr = Array.from(Array(100).keys());
  const cScale = scaleSequential().interpolator(colorLevelMap).domain([0, 99]);
  var xScale = scaleLinear().domain([0, 99]).range([0, LEGEND_LINEAR_WIDTH]);

  d3.select("#scatter-legend")
    .selectAll("rect")
    .data(continuousValArr)
    .enter()
    .append("rect")
    .attr("x", (d) => Math.floor(xScale(d)))
    .attr("y", 0)
    .attr("height", LEGEND_HEIGHT)
    .attr("width", (d) => {
      return Math.floor(xScale(d + 1)) - Math.floor(xScale(d));
    })
    .style("opacity", OPACITY)
    .style("stroke", "")
    .attr("fill", (d) => cScale(d));

  d3.select("#scatter-legend")
    .selectAll("txt")
    .data(extremeVals)
    .enter()
    .append("text")
    .text((d) => d.toFixed(1))
    .attr("x", (d, i) => i * LEGEND_LINEAR_WIDTH)
    .attr("font-size", LEGEND_FONT_SIZE)
    .attr("y", LEGEND_HEIGHT + LEGEND_FONT_SIZE * 1.5);
};

export default ScatterMap;
