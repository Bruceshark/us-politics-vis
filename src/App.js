import ScatterTab from "./components/ScatterTab.js";
import AreaTab from "./components/AreaTab.js";
import LineUp from "./components/LineUp.js"
import React, { Component } from "react";
import { Layout, Select, Col, Row } from "antd";
import "./App.css";
const { Header, Content } = Layout;
const { Option } = Select;
const tabList = ["Scatter", "Area", "Area - changes"];
const yearList = [2012, 2014, 2016, 2018, 2020];
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 0,
    };
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
              <Col span={2} offset={10}>
                <Select
                  defaultValue={2012}
                  style={{ width: 120, color: "white" }}
                  bordered={false}
                >
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
                {this.state.selectedTab === 1 && <AreaTab />}
                {this.state.selectedTab === 2 && <AreaTab />}
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
