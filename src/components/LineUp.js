import React, { useEffect, useState } from "react";
import LineUpLite, {
  asTextColumn,
  asNumberColumn,
  asCategoricalColumn,
  asDateColumn,
  LineUpLiteColumn,
  featureDefault,
} from "@lineup-lite/table";
import * as d3 from "d3";
import { numberStatsGenerator, NumberBar, NumberColor, NumberSymbol } from "@lineup-lite/components";
import "@lineup-lite/table/dist/table.css";

const partyList = [
  "race_european",
  "race_asian",
  "race_african",
  "race_hispanic",
  "race_other"
]
const raceList = [
  "party_democrat",
  "party_republican",
  "party_nonpartisan"
]

const party_dic = ["democrat", "republican", "nonpartisan"]
const partymap = {"democrat": 0, "republican": 1, "nonpartisan": 2}
const race_dic = ["european", "asian", "african", "hispanic", "other"]
const racemap = {"european": 0, "asian": 1, "african": 2, "hispanic": 3, "other": 4}
const years = ["2012", "2016", "2020"]


var distribution = {"2012": {}, "2016": {}, "2020": {}};

var votedData = []
var nonVotedData = []
const LineUp = ({data, year1}) => {
  const [lineUpData, setData] = useState([])
  useEffect(() => {
    genLineUp(year1, data)
  }, [data, year1])
  const genLineUp = (year, data) => {
    var keyList = []
    var allKeyList = []
    //console.log(data[year][0])
    //console.log(votedKeyList, nonVotedKeyList)
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
          tmpData["voted"]["county"] = element[subkey]
          tmpData["nonvoted"]["county"] = element[subkey]
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

    //now voted data
    setData(votedData)
  }
  // console.log("voted ==>",votedData.slice(1, 3))
  // console.log("nonvoted ==>",nonVotedData)

  
    const features = featureDefault()

    const testdata = [
        {
          "county": "00013",
          "voting_rate": 0.35,
          "race_european": 1,
          "race_asian": 3,
          "race_african": 5,
          "race_hispanic": 7,
          "race_other": 9,
          "party_democrat": 2,
          "party_republican": 4,
          "party_nonpartisan": 1
        },
        {
          "county": "00405",
          "voting_rate": 0.71,
          "race_european": 0,
          "race_asian": 0,
          "race_african": 0,
          "race_hispanic": 0,
          "race_other": 0,
          "party_democrat": 0,
          "party_republican": 0,
      },
      ]
  
    const testcolumns = [asTextColumn("county"), asNumberColumn("voting_rate"), asNumberColumn("race_european"), asNumberColumn("race_asian"), asNumberColumn("race_african"), 
      asNumberColumn("race_hispanic"), asNumberColumn("race_other"),
      asNumberColumn("party_democrat"), asNumberColumn("party_republican"), asNumberColumn("party_nonpartisan"),]
    return (
    <div>
      <LineUpLite data={lineUpData} columns={testcolumns} features={features} />
    </div>
    )
  }

  export default LineUp;