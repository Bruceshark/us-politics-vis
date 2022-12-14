import React, { useEffect } from "react";
import * as d3 from "d3";
import { geoAlbersUsa, geoPath } from "d3-geo";
import { scaleLinear, scaleSequential } from "d3-scale";
import { feature } from "topojson-client";
var projection;
var geoMapData, extremeVals, normalizeAttr, colorLevelMap;

const CONTINUOUS_COLOR_LIST = ["#d0efff", "#03254c"];
const CONTINUOUS_COLOR_LIST_NEG_TO_POS = ["#0000cc", "#c0c0c0", "#cc0000"];
const LEGEND_FONT_SIZE = 10;
const LEGEND_HEIGHT = 20;
const LEGEND_LINEAR_WIDTH = 200;

const AreaMap = ({ countyData, yearNum }) => {
  // load the original dataset and draw the background map at the beginning
  useEffect(() => {
    async function mount() {
      geoMapData = await d3.json("map-data.json");
      drawBgMap();
      drawContinuousLegendScale();
    }
    mount();
  }, []);
  useEffect(() => {
    d3.select("#area-map").selectAll("svg > circle").remove();
    if (yearNum === 1) {
      colorLevelMap = d3.interpolateRgb(
        d3.rgb(CONTINUOUS_COLOR_LIST[0]),
        d3.rgb(CONTINUOUS_COLOR_LIST[CONTINUOUS_COLOR_LIST.length - 1])
      );
      extremeVals = [0,1]
      normalizeAttr = d3.scaleLinear().domain(extremeVals).range([0, 1]);
    }
    if (yearNum === 2) {
      colorLevelMap = d3
        .scaleLinear()
        .domain([0, 0.5, 1])
        .range(CONTINUOUS_COLOR_LIST_NEG_TO_POS)
        .interpolate(d3.interpolateHcl);
      extremeVals = [-1,1]
      normalizeAttr = d3.scaleLinear().domain(extremeVals).range([0, 1]);
    }
    drawAreas(countyData);
  }, [countyData, yearNum]);

  return (
    <div id="map-outer" style={{ width: "100%", textAlign: "center" }}>
      <svg id="area-map"></svg>
      <svg id="area-legend"></svg>
    </div>
  );
};

const drawBgMap = () => {
  var width = document.getElementById("map-outer").offsetWidth;
  var height = (width / 10) * 8;
  projection = geoAlbersUsa()
    .translate([width / 2, height / 2])
    .scale([width * 1.2]);
  var path = geoPath().projection(projection);
  var svg = d3.select("#area-map").attr("width", width).attr("height", height);
  d3.select("#area-legend").attr("width", width).attr("height", LEGEND_HEIGHT + LEGEND_FONT_SIZE * 2);
  svg
    .selectAll("path")
    .data(feature(geoMapData, geoMapData.objects.counties).features)
    .enter()
    .append("path")
    .attr("d", path)
    .style("stroke", "white")
    .style("stroke-width", "1")
    .attr("id", function (d) {
      return d.id;
    })
    .style("fill", function (d) {
      return "rgb(240, 242, 241)";
    });
};

const drawAreas = (countyValDict) => {
  d3.select("#area-map")
    .selectAll("path")
    .style("fill", function (d) {
      let id = String(d.id);
      if (id.length < 5) {
        id = "0" + id;
      }
      if (id in countyValDict) {
        return colorLevelMap(normalizeAttr(countyValDict[id]));
      } else {
        return "rgb(240, 242, 241)";
      }
    });
};

const drawContinuousLegendScale = () => {
  const continuousValArr = Array.from(Array(100).keys());
  const cScale = scaleSequential().interpolator(colorLevelMap).domain([0, 99]);
  var xScale = scaleLinear().domain([0, 99]).range([0, LEGEND_LINEAR_WIDTH]);

  d3.select("#area-legend")
    .selectAll("rect")
    .data(continuousValArr)
    .enter()
    .append("rect")
    .attr("x", (d) => Math.floor(xScale(d)) + LEGEND_FONT_SIZE/2)
    .attr("y", 0)
    .attr("height", LEGEND_HEIGHT)
    .attr("width", (d) => {
      return Math.floor(xScale(d + 1)) - Math.floor(xScale(d));
    })
    .style("stroke", "")
    .attr("fill", (d) => cScale(d));

  d3.select("#area-legend")
    .selectAll("txt")
    .data(extremeVals)
    .enter()
    .append("text")
    .text((d) => d.toFixed(1))
    .attr("x", (d, i) => i * LEGEND_LINEAR_WIDTH)
    .attr("font-size", LEGEND_FONT_SIZE)
    .attr("y", LEGEND_HEIGHT + LEGEND_FONT_SIZE * 1.5);
};

export default AreaMap;
