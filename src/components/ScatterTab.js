import ScatterMap from "./ScatterMap.js";
import React, { Component } from "react";
import { Col, Row, Select } from "antd";
const { Option } = Select;
const attrList = [
  "exposure",
  "impute_party",
  "income",
  "edu_level",
  "BallotType_General_2020_11_03",
  "BallotType_General_2018_11_06",
  "BallotType_General_2016_11_08",
  "BallotType_General_2014_11_04",
  "BallotType_General_2012_11_06",
  "BallotType_General_2010_11_02",
  "BallotType_General_2008_11_04",
  "BallotType_General_2006_11_07",
  "BallotType_General_2004_11_02",
];
const ethnicList = [
  "East and South Asian",
  "European",
  "Hispanic and Portuguese",
  "Likely African-American",
  "Other",
];
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ethnicFilter: [],
      attrFilter: [],
    };
  }
  render() {
    return (
      <Row>
        <Col span={18}>
          <ScatterMap
            ethnicFilter={this.state.ethnicFilter}
            attrFilter={this.state.attrFilter}
          />
        </Col>
        <Col span={6} style={{ alignSelf: "center", padding: "2%" }}>
          <Select
            // mode="multiple"
            allowClear
            style={{ width: "100%" }}
            placeholder="select an attribute to explore"
            onChange={(val) => {
              this.setState({
                attrFilter: val,
              });
            }}
          >
            {attrList.map((val) => (
              <Option key={val}>{val}</Option>
            ))}
          </Select>
          <br />
          <br />
          <Select
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            placeholder="select a race"
            onChange={(val) => {
              this.setState({
                ethnicFilter: val,
              });
            }}
          >
            {ethnicList.map((val) => (
              <Option key={val}>{val}</Option>
            ))}
          </Select>
        </Col>
      </Row>
    );
  }
}

export default App;
