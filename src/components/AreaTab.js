import AreaMap from "./AreaMap.js";
import React, { Component } from "react";
import { Col, Row, Select } from "antd";
const { Option } = Select;
const attrList = [
  "impute_party_republican",
  "income_avg",
  "education_level_avg",
  "voting_rate_2020",
  "voting_rate_2012",
  "ballot_type_absentee_2012",
  "ballot_type_early_2012",
  "ballot_type_poll_vote_2012",
  "ballot_type_provisional_2012",
  "ballot_type_other_2012",
  "ballot_type_no_vote_2012",
  "ballot_type_absentee_2020",
  "ballot_type_early_2020",
  "ballot_type_poll_vote_2020",
  "ballot_type_provisional_2020",
  "ballot_type_other_2020",
  "ballot_type_no_vote_2020",
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
      <div>
        <Row gutter={16}>
          <Col span={10} offset={2}>
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
          </Col>
          <Col span={10}>
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
        <AreaMap
          ethnicFilter={this.state.ethnicFilter}
          attrFilter={this.state.attrFilter}
        />
      </div>
    );
  }
}

export default App;
