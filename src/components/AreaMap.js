import React, { useEffect } from "react";
import * as d3 from "d3";
import { geoAlbersUsa, geoPath } from "d3-geo";
import { scaleLinear, scaleSequential } from "d3-scale";
import { feature } from "topojson-client";
var projection;
var geoMapData,
  populationData,
  dataset,
  extremeVals,
  colorList,
  normalizeAttr,
  colorLevelMap,
  attr;
const CONTINUOUS_COLOR_LIST = ["#d0efff", "#03254c"];
const PARTY_COLOR_LIST = ["#0000cc", "#cc0000"];
const PARTY_TEXT_LIST = ["Republican", "Democrat"];
const LEGEND_FONT_SIZE = 10;
const LEGEND_HEIGHT = 20;
const LEGEND_LINEAR_WIDTH = 200;

const AreaMap = ({ ethnicFilter, attrFilter }) => {
  // load the original dataset and draw the background map at the beginning
  useEffect(() => {
    async function mount() {
      dataset = await d3.json("area_map_dataset.json"); // 之后要从组件外载入
      populationData = await d3.json("population_by_county.json");
      geoMapData = await d3.json("map-data.json");
      drawBgMap();
    }
    mount();
  }, []);
  // attribute filter change, redraw the legend and maybe redraw the scatter
  useEffect(() => {
    async function processNewScale() {
      normalizeAttr = d3
        .scaleLinear()
        .domain([extremeVals[0], extremeVals[1]])
        .range([0, 1]);
    }
    if (attrFilter && attrFilter.length > 0) {
      d3.select("#area-map").selectAll("svg > circle").remove();
      d3.select("#area-legend").selectAll("*").remove();
      attr = attrFilter;
      if (attr === "impute_party_republican") {
        colorList = PARTY_COLOR_LIST;
      } else {
        colorList = CONTINUOUS_COLOR_LIST;
      }
      const maxVal = Math.max(
        ...Object.values(dataset).map((ethnicData) => {
          return Math.max(...Object.values(ethnicData[attr]));
        })
      );
      const minVal = Math.min(
        ...Object.values(dataset).map((ethnicData) => {
          return Math.min(...Object.values(ethnicData[attr]));
        })
      );

      extremeVals = [0, 1];
      if (maxVal > 1 || minVal < 0) {
        extremeVals = [minVal, maxVal];
      }
      if (attr === "impute_party_republican") {
        colorLevelMap = d3
          .scaleLinear()
          .domain([0, 0.5, 1])
          .range([colorList[0], "#c0c0c0", colorList[1]])
          .interpolate(d3.interpolateHcl);
      } else {
        colorLevelMap = d3.interpolateRgb(
          d3.rgb(colorList[0]),
          d3.rgb(colorList[colorList.length - 1])
        );
      }

      processNewScale();
      drawContinuousLegendScale();

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
      drawDots(ethnicFilter);
    } else {
      d3.select("#area-map")
        .selectAll("svg > path")
        .style("fill", function (d) {
          return "rgb(240, 242, 241)";
        });
    }
  }, [ethnicFilter]);
  return (
    <div style={{ textAlign: "center" }}>
      <svg id="area-map"></svg>
      <svg id="area-legend"></svg>
    </div>
  );
};

const drawBgMap = () => {
  var width = (window.innerWidth / 100) * 60;
  var height = (window.innerHeight / 100) * 60;
  projection = geoAlbersUsa()
    .translate([width / 2, height / 2])
    .scale([width]);
  var path = geoPath().projection(projection);
  var svg = d3.select("#area-map").attr("width", width).attr("height", height);
  d3.select("#area-legend").attr("width", width).attr("height", 150);
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

const drawDots = (ethnicFilter) => {
  let countyValDict = {};
  let countyPopDict = {};
  let countyMeanDict = {};
  ethnicFilter.forEach((ethnic) => {
    let ethnicData = dataset[ethnic][attr];
    let ethnicPopulation = populationData[ethnic];
    Object.keys(ethnicData).forEach((countyCode) => {
      if (countyCode in countyValDict) {
        countyValDict[countyCode] =
          countyValDict[countyCode] +
          ethnicData[countyCode] * ethnicPopulation[countyCode];
      } else {
        countyValDict[countyCode] =
          ethnicData[countyCode] * ethnicPopulation[countyCode];
      }
      if (countyCode in countyPopDict) {
        countyPopDict[countyCode] =
          countyPopDict[countyCode] + ethnicPopulation[countyCode];
      } else {
        countyPopDict[countyCode] = ethnicPopulation[countyCode];
      }
    });
  });
  Object.keys(countyValDict).forEach((countyCode) => {
    countyMeanDict[countyCode] =
      countyValDict[countyCode] / countyPopDict[countyCode];
  });
  d3.select("#area-map")
    .selectAll("path")
    .style("fill", function (d) {
      let id = String(d.id);
      if (id.length < 5) {
        id = "0" + id;
      }
      if (id in countyMeanDict) {
        return colorLevelMap(normalizeAttr(countyMeanDict[id]));
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
    .attr("x", (d) => Math.floor(xScale(d)))
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
