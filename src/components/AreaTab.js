import AreaMap from "./AreaMap.js";
import React, { useEffect, useState } from "react";
import { Col, Row, Select } from "antd";
import _ from "lodash";
const { Option } = Select;
const attrList = [
  { label: "voting rate", value: "voting" },
  { label: "population rate", value: "population" },
];
const ethnicList = [
  { label: "East and South Asian", value: "asian" },
  { label: "European", value: "european" },
  { label: "Hispanic and Portuguese", value: "hispanic" },
  { label: "Likely African-American", value: "african" },
  { label: "Other", value: "other" },
];
const partyList = [
  { label: "Democrat", value: "democrat" },
  { label: "Republican", value: "republican" },
  { label: "Non partisan", value: "nonpartisan" },
];

var selectedAttr = null;
var selectedPartyList = [];
var selectedEthnicList = [];
const AreaTab = ({ dataset, year1 }) => {
  const [countyData, setData] = useState({})
  useEffect(() => {
    handleChangeFilter()
  }, [dataset, year1]);
  const handleChangeFilter = () => {
    if (!selectedAttr) return;
    if (selectedPartyList.length === 0 && selectedEthnicList.length === 0)
      return;
    let allowedPartyList =
      selectedPartyList.length === 0
        ? partyList.map((ele) => ele.value)
        : selectedPartyList;
    let allowedEthnicList =
      selectedEthnicList.length === 0
        ? ethnicList.map((ele) => ele.value)
        : selectedEthnicList;
    let countyValDict = {}
    let focusKeyList = [];
    let allKeyList = [];
    if (selectedAttr === "voting") {
      Object.keys(dataset[year1][0]).forEach((key) => {
        if (key === "county") return;
        let [voted, ethnic, party] = key.split("_");
        if (
          allowedEthnicList.indexOf(ethnic) > -1 &&
          allowedPartyList.indexOf(party) > -1
        ) {
          allKeyList.push(key);
          if (voted === "voted") {
            focusKeyList.push(key);
          }
        }
      });
    }
    if (selectedAttr === "population") {
      Object.keys(dataset[year1][0]).forEach((key) => {
        if (key === "county") return;
        allKeyList.push(key);
        let [voted, ethnic, party] = key.split("_");
        if (
          allowedEthnicList.indexOf(ethnic) > -1 &&
          allowedPartyList.indexOf(party) > -1
        ) {
          focusKeyList.push(key)
        }
      });
    }
    dataset[year1].forEach((countyData) => {
      let votedValList = Object.values(_.pick(countyData, focusKeyList)).map(Number);
      let allValList = Object.values(_.pick(countyData, allKeyList)).map(Number);
      let votedSum = _.sum(votedValList)
      let allSum = _.sum(allValList);
      let ratio
      if (allSum === 0) {
        ratio = 0
      } else {
        ratio = votedSum / allSum
      }
      countyValDict[countyData.county] = ratio
    });
    setData({...countyValDict})
    // console.log(countyData)
  };
  return (
    <div>
      <AreaMap
        countyData={countyData}
      // ethnicFilter={ethnicFilter.value}
      // partyFilter={attrFilter.value}
      // attrFilter={partyFilter.value}
      />
      <Row gutter={16}>
        <Col span={6} offset={2}>
          <Select
            // mode="multiple"
            allowClear
            style={{ width: "100%" }}
            placeholder="select an attribute to explore"
            onChange={(val) => {
              selectedAttr = val;
              handleChangeFilter();
            }}
          >
            {attrList.map((val) => (
              <Option key={val.value}>{val.label}</Option>
            ))}
          </Select>
        </Col>
        <Col span={6}>
          <Select
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            placeholder="select a race"
            onChange={(val) => {
              selectedEthnicList = val;
              handleChangeFilter();
            }}
          >
            {ethnicList.map((val) => (
              <Option key={val.value}>{val.label}</Option>
            ))}
          </Select>
        </Col>
        <Col span={6}>
          <Select
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            placeholder="select a party"
            onChange={(val) => {
              selectedPartyList = val;
              handleChangeFilter();
            }}
          >
            {partyList.map((val) => (
              <Option key={val.value}>{val.label}</Option>
            ))}
          </Select>
        </Col>
      </Row>
    </div>
  );
};

export default AreaTab;
