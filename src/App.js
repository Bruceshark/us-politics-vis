import ScatterTab from "./components/ScatterTab.js";
import AreaTab from "./components/AreaTab.js";
import LineUp from "./components/LineUp.js"
import React, { Component } from "react";
import { Layout, Select, Col, Row } from "antd";
import "./App.css";
import * as d3 from "d3";

const { Header, Content } = Layout;
const { Option } = Select;
const tabList = ["Scatter", "Area", "Area - changes"];
const yearList = ["2012", "2016", "2020"];
var dataset = {};
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 1,
      selectedYear1: "2012",
      selectedYear2: "2020"
    };
  }
  async componentDidMount() {
    for (let yearIdx in yearList) {
      let year = yearList[yearIdx]
      dataset[year] = await d3.csv(`dataset/${year}.csv`)
    }
    console.log("===dataset loaded===")
    console.log(dataset)
  }
  render() {
    return (
      <div className="App">
        <Layout style={{ minHeight: "100vh", overflow: "hidden" }}>
          <Header>
            <Row>
              <Col span={12}>
                <Row gutter={16}>
                  {tabList.map((ele, idx) => {
                    return (
                      <Col
                        key={idx}
                        className={this.state.selectedTab === idx ? "btn btn-selected" : "btn"}
                        onClick={() => this.setState({ selectedTab: idx })}
                      >
                        {ele}
                      </Col>
                    );
                  })}
                </Row>
              </Col>
              <Col span={2} offset={8}>
                <Select
                  defaultValue={this.state.selectedYear1}
                  style={{ width: 120, color: "white" }}
                  bordered={false}
                  onChange={(val) => {
                    this.setState({
                      selectedYear1: val,
                    });
                  }}                >
                  {yearList.map((ele, idx) => {
                    return (
                      <Option key={idx} value={ele}>
                        {ele}
                      </Option>
                    );
                  })}
                </Select>
              </Col>
              <Col span={2}>
                <Select
                  disabled={this.state.selectedTab !== 2}
                  defaultValue={this.state.selectedYear2}
                  style={{ width: 120, color: "white" }}
                  bordered={false}
                  onChange={(val) => {
                    this.setState({
                      selectedYear2: val,
                    });
                  }}                >
                  {yearList.map((ele, idx) => {
                    return (
                      <Option key={idx} value={ele}>
                        {ele}
                      </Option>
                    );
                  })}
                </Select>
              </Col>
            </Row>
          </Header>
          <Row
            style={{ height: "calc(100vh - 64px)", padding: "0.5rem" }}
            gutter={10}
          >
            <Col span={10} style={{ height: "100%" }}>
              <Content
                style={{
                  height: "100%",
                  padding: "1rem",
                }}
              >
                <div className="view-header">
                  <div>Map View</div>
                  <div className="divider" />
                </div>
                {this.state.selectedTab === 0 && <ScatterTab />}
                {this.state.selectedTab === 1 && <AreaTab dataset={dataset} year1={this.state.selectedYear1}/>}
                {this.state.selectedTab === 2 && <AreaTab dataset={dataset} year1={this.state.selectedYear1} year2={this.state.selectedYear2}/>}
              </Content>
            </Col>
            <Col span={14} style={{ height: "100%" }}>
              <Content
                style={{
                  height: "100%",
                  padding: "1rem",
                }}
              >
                <div className="view-header">
                  <div>Lineup View</div>
                  <div className="divider" />
                </div>
                {<LineUp />}
              </Content>
            </Col>
          </Row>
        </Layout>
      </div>
    );
  }
}

export default App;
