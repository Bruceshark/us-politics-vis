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
const AreaTab = ({ dataset, year1, year2 }) => {
  const [countyData, setData] = useState({});
  useEffect(() => {
    selectedPartyList = [];
    selectedEthnicList = [];
    selectedAttr = null;
  }, []);
  useEffect(() => {
    handleChangeFilter();
  }, [dataset, year1, year2]);
  const handleChangeFilter = () => {
    if (!selectedAttr) return;
    if (selectedPartyList.length === 0 || selectedEthnicList.length === 0)
      return;
    let countyValDict;
    if (year2) {
      let countyValDict1 = processSingleYear(year1);
      let countyValDict2 = processSingleYear(year2);
      countyValDict = {};
      Object.keys(countyValDict1).forEach((key) => {
        countyValDict[key] = countyValDict2[key] - countyValDict1[key];
      });
    } else {
      countyValDict = processSingleYear(year1);
    }
    setData({ ...countyValDict });
  };
  const processSingleYear = (year) => {
    let countyValDict = {};
    let focusKeyList = [];
    let allKeyList = [];
    if (selectedAttr === "voting") {
      Object.keys(dataset[year][0]).forEach((key) => {
        if (key === "county") return;
        let [voted, ethnic, party] = key.split("_");
        if (
          selectedEthnicList.indexOf(ethnic) > -1 &&
          selectedPartyList.indexOf(party) > -1
        ) {
          allKeyList.push(key);
          if (voted === "voted") {
            focusKeyList.push(key);
          }
        }
      });
    }
    if (selectedAttr === "population") {
      Object.keys(dataset[year][0]).forEach((key) => {
        if (key === "county") return;
        allKeyList.push(key);
        let [voted, ethnic, party] = key.split("_");
        if (
          selectedEthnicList.indexOf(ethnic) > -1 &&
          selectedPartyList.indexOf(party) > -1
        ) {
          focusKeyList.push(key);
        }
      });
    }
    dataset[year].forEach((countyData) => {
      let votedValList = Object.values(_.pick(countyData, focusKeyList)).map(
        Number
      );
      let allValList = Object.values(_.pick(countyData, allKeyList)).map(
        Number
      );
      let votedSum = _.sum(votedValList);
      let allSum = _.sum(allValList);
      let ratio;
      if (allSum === 0) {
        ratio = 0;
      } else {
        ratio = votedSum / allSum;
      }
      countyValDict[countyData.county] = ratio;
    });
    return countyValDict;
  };
  return (
    <div>
      <AreaMap countyData={countyData} yearNum={year2 ? 2 : 1} />
      <Row gutter={16}>
        <Col span={8}>
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
        <Col span={8}>
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
        <Col span={8}>
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
