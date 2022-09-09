import ScatterTab from "./components/ScatterTab.js";
import AreaTab from "./components/AreaTab.js";
import React, { Component } from "react";
import { Tabs } from "antd";
import "./App.css";
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
      <div className="App">
        <Tabs defaultActiveKey="2">
          <Tabs.TabPane tab="scatter" key="1">
            <ScatterTab />
          </Tabs.TabPane>
          <Tabs.TabPane tab="area" key="2" forceRender={true}>
            <AreaTab />
          </Tabs.TabPane>
        </Tabs>
      </div>
    );
  }
}

export default App;
