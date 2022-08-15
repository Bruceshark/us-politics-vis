import Map from "./components/Map.js";
import React, { Component } from "react";
import { Col, Row, Select } from "antd";
import "./App.css";
const { Option } = Select;
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
    };
  }
  render() {
    return (
      <div className="App">
        <Row>
          <Col span={18}>
            <Map ethnicFilter={this.state.ethnicFilter} />
          </Col>
          <Col span={6} style={{alignSelf: 'center'}}>
            <Select
              mode="multiple"
              allowClear
              style={{ width: "100%" }}
              placeholder="Please select"
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
      </div>
    );
  }
}

export default App;
