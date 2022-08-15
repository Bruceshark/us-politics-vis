import React, { Component } from "react";
import * as d3 from "d3";
import { geoAlbersUsa, geoPath } from "d3-geo";
import { scaleLinear, scaleSequential } from "d3-scale";
import { feature } from "topojson-client";
var projection;
class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ethnicFilter: props.ethnicFilter,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { ethnicFilter } = this.state;
    const newdata = nextProps.ethnicFilter.toString();
    if (ethnicFilter.toString() !== newdata) {
      this.setState({
        ethnicFilter: nextProps.ethnicFilter,
      });
      d3.select("#map").selectAll("svg > circle").remove();
      this.drawDots();
    }
  }

  componentDidMount() {
    this.drawBgMap();
    this.drawDots();
    this.drawLegendScale();
  }
  drawBgMap() {
    var width = (window.innerWidth / 100) * 60;
    var height = (window.innerHeight / 100) * 60;
    projection = geoAlbersUsa()
      .translate([width / 2, height / 2])
      .scale([1000]);
    var path = geoPath().projection(projection);
    var svg = d3.select("#map").attr("width", width).attr("height", height);
    d3.json("map-data.json").then((data) => {
      svg
        .selectAll("path")
        .data(feature(data, data.objects.states).features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("stroke", "white")
        .style("stroke-width", "1")
        .style("fill", "rgb(213,222,217)");
    });
  }
  drawDots() {
    const colorLevelMap = d3.interpolateRgb(d3.rgb("blue"), d3.rgb("white"));
    d3.csv("exposure_dataset.csv").then((data) => {
      d3.select("#map")
        .selectAll("circle")
        .data(
          data.filter(
            (ele) =>
              this.state.ethnicFilter.indexOf(
                ele.EthnicGroups_EthnicGroup1Desc
              ) > -1
          )
        )
        .enter()
        .append("circle")
        .attr("cx", function (d) {
          if (
            projection([
              d.Residence_Addresses_Longitude,
              d.Residence_Addresses_Latitude,
            ])
          ) {
            return projection([
              d.Residence_Addresses_Longitude,
              d.Residence_Addresses_Latitude,
            ])[0];
          }
        })
        .attr("cy", function (d) {
          if (
            projection([
              d.Residence_Addresses_Longitude,
              d.Residence_Addresses_Latitude,
            ])
          ) {
            return projection([
              d.Residence_Addresses_Longitude,
              d.Residence_Addresses_Latitude,
            ])[1];
          }
        })
        .attr("r", function (d) {
          return 2;
        })
        .style("fill", function (d) {
          return colorLevelMap(d.exposure);
        });
    });
  }
  drawLegendScale() {
    var width = 140;
    var height = 40;
    const colorLevelMap = d3.interpolateRgb(d3.rgb("blue"), d3.rgb("white"));
    var data = Array.from(Array(100).keys());
    var cScale = scaleSequential().interpolator(colorLevelMap).domain([0, 99]);
    var xScale = scaleLinear().domain([0, 99]).range([0, width]);
    d3.select("#legend")
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => Math.floor(xScale(d)))
      .attr("y", 0)
      .attr("height", height)
      .attr("width", (d) => {
        return Math.floor(xScale(d + 1)) - Math.floor(xScale(d)) + 1;
      })
      .attr("fill", (d) => cScale(d));
    d3.select("#legend")
      .append("text")
      .text("1")
      .attr("x", () => xScale(0))
      .attr("y", height + 15);
    d3.select("#legend")
      .append("text")
      .text("0")
      .attr("x", () => xScale(100))
      .attr("y", height + 15);
  }
  render() {
    return (
      <div style={{ textAlign: "center" }}>
        <svg id="map"></svg>
        <svg id="legend"></svg>
      </div>
    );
  }
}

export default Map;
