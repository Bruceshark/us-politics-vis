import React, { useEffect, useState } from "react";
import {
  LineUpLiteVirtual,
  asTextColumn,
  asNumberColumn,
  asCategoricalColumn,
  asDateColumn,
  LineUpLiteColumn,
  featureDefault,
} from '@lineup-lite/table';
import '@lineup-lite/table/dist/table.css';
import { Col, Row, Select } from "antd";
import * as d3 from "d3";
import "@lineup-lite/table/dist/table.css";

const party_dic = ["democrat", "republican", "nonpartisan"]
const partymap = {"democrat": 0, "republican": 1, "nonpartisan": 2}
const race_dic = ["european", "asian", "african", "hispanic", "other"]
const racemap = {"european": 0, "asian": 1, "african": 2, "hispanic": 3, "other": 4}

const { Option } = Select;
const voteList = [
  { label: "voted", value: "voted" },
  { label: "non-voted", value: "nonvoted" },
];

var votedData = []
var nonVotedData = []
var selectVoteState = null;
const LineUp = ({data, year1, fipsMap}) => {
  const [lineUpData, setData] = useState([])

  useEffect(() => {
    genLineUp(year1, data, fipsMap)
    handleChangeFilter();
  }, [data, year1, fipsMap])

  const genLineUp = (year, data, fipsMap) => {
    data[year].forEach(element => {
      //console.log(element)
      var tmpData = {"total": 0,"voted": {}, "nonvoted": {}}
      var total = 0
      var voted = 0
      // ["democrat", "republican", "nonpartisan"]
      var voted_party = [0, 0, 0]
      var nonvoted_party = [0, 0, 0]
      // ["european", "asian", "african", "hispanic", "other"]
      var voted_race = [0, 0, 0, 0, 0]
      var nonvoted_race = [0, 0, 0, 0, 0]
      for(var subkey in element){
        if(subkey === 'county'){
          tmpData["voted"]["county"] = fipsMap[element[subkey]]
          tmpData["nonvoted"]["county"] = fipsMap[element[subkey]]
          continue;
        }
        total = total + Number(element[subkey])
        const split_dic = subkey.split("_")
        if(split_dic[0] === "voted"){
          voted += Number(element[subkey])
          voted_party[partymap[split_dic[2]]] += Number(element[subkey])
          voted_race[racemap[split_dic[1]]] += Number(element[subkey])
        }
        else{
          nonvoted_party[partymap[split_dic[2]]] += Number(element[subkey])
          nonvoted_race[racemap[split_dic[1]]] += Number(element[subkey])
        }
      }
      tmpData["total"] = total
      tmpData["voted"]["voting_rate"] = voted / total
      tmpData["nonvoted"]["voting_rate"] = voted / total
      for(var j in party_dic){
        tmpData["voted"]["party_"+party_dic[j]] = voted_party[partymap[party_dic[j]]] / total
        tmpData["nonvoted"]["party_"+party_dic[j]] = nonvoted_party[partymap[party_dic[j]]] / total
      }
      for(var j in race_dic){
        tmpData["voted"]["race_"+race_dic[j]] = voted_race[racemap[race_dic[j]]] / total
        tmpData["nonvoted"]["race_"+race_dic[j]] = nonvoted_race[racemap[race_dic[j]]] / total
      }
      
      //console.log("total", tmpData)
      votedData.push(tmpData["voted"])
      nonVotedData.push(tmpData["nonvoted"])
      //console.log(voted_party, voted_race)
    })
  }

  const handleChangeFilter = () => {
    if (!selectVoteState) return;
    if(selectVoteState === "voted"){
      setData(votedData)
    }else{
      setData(nonVotedData)
    }
  }
  // console.log("voted ==>",votedData.slice(1, 3))
  // console.log("nonvoted ==>",nonVotedData)

  
    const features = featureDefault()
  
    const testcolumns = [asTextColumn("county"), asNumberColumn("voting_rate"), asNumberColumn("race_european"), asNumberColumn("race_asian"), asNumberColumn("race_african"), 
      asNumberColumn("race_hispanic"), asNumberColumn("race_other"),
      asNumberColumn("party_democrat"), asNumberColumn("party_republican"), asNumberColumn("party_nonpartisan"),]
    return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Select
            // mode="multiple"
            allowClear
            style={{ width: "100%" }}
            placeholder="select an attribute to explore"
            onChange={(val) => {
              selectVoteState = val;
              handleChangeFilter();
            }}
          >
            {voteList.map((val) => (
              <Option key={val.value}>{val.label}</Option>
            ))}
          </Select>
        </Col>
      </Row>
      <div>
      <LineUpLiteVirtual data={lineUpData} columns={testcolumns} features={features} estimatedSize={25} style={{ height: 1200 }}/>
      </div>
    </div>
    )
  }

  export default LineUp;