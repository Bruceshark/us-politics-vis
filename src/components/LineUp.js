import React, { useEffect } from 'react';
import LineUpLite, {
  asTextColumn,
  asNumberColumn,
  asCategoricalColumn,
  asDateColumn,
  LineUpLiteColumn,
  featureDefault,
} from '@lineup-lite/table';
import * as d3 from "d3";
import { numberStatsGenerator, NumberBar, NumberColor, NumberSymbol } from '@lineup-lite/components';
import '@lineup-lite/table/dist/table.css';

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
const years = ['2012', '2016', '2020']
var data, flag = 0;

const LineUp = () => {
  // const lineUpData = d3.json("frontend_data.json").then((data)=> {
  //   for(var item in data['2012']){
  //     var voted = data['2012'][item]['voted']
  //     voted = {
  //       ...voted,
  //       "county": item
  //     }
  //     stats.push(voted)
  //   }
  // });
    async function mount(){
      data = await d3.json('lineup_cluster.json')
      var distribution = {'2012': {}, '2016': {}, '2020': {}}
      for(var i in years){
        const year = years[i]
        //console.log(i)
        for(var key in data[year]){
          distribution[year][key] = {'total': 0, 'voting': 0, 'voted': {}, 'nonvoted': {}}
          var total = 0
          var voted = 0
          // ["democrat", "republican", "nonpartisan"]
          var voted_party = [0, 0, 0]
          var nonvoted_party = [0, 0, 0]
          // ["european", "asian", "african", "hispanic", "other"]
          var voted_race = [0, 0, 0, 0, 0]
          var nonvoted_race = [0, 0, 0, 0, 0]
          for(var subkey in data[year][key]){
              total = total + data[year][key][subkey]
              const split_dic = subkey.split("_")
              if(split_dic[0] === 'voted'){
                voted += data[year][key][subkey]
                voted_party[partymap[split_dic[2]]] += data[year][key][subkey]
                voted_race[racemap[split_dic[1]]] += data[year][key][subkey]
              }
              else{
                nonvoted_party[partymap[split_dic[2]]] += data[year][key][subkey]
                nonvoted_race[racemap[split_dic[1]]] += data[year][key][subkey]
              }
          }
          distribution[year][key]["total"] = total
          distribution[year][key]["voting"] = voted / total
          for(var j in race_dic){
            distribution[year][key]["voted"]["race_"+race_dic[j]] = voted_race[racemap[race_dic[j]]] / total
            distribution[year][key]["nonvoted"]["race_"+race_dic[j]] = nonvoted_race[racemap[race_dic[j]]] / total
          }
          for(var j in party_dic){
            distribution[year][key]['voted']['party_'+party_dic[j]] = voted_party[partymap[party_dic[j]]] / total
            distribution[year][key]['nonvoted']['party_'+party_dic[j]] = nonvoted_party[partymap[party_dic[j]]] / total
          }
        }
      }
      console.log("distribution ==>",distribution)
    }
    mount();

  
    const features = React.useMemo(() => featureDefault(), []);

    const testdata = React.useMemo(
      () => [
        {
          "county": "00013",
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
          "race_european": 0,
          "race_asian": 0,
          "race_african": 0,
          "race_hispanic": 0,
          "race_other": 0,
          "party_democrat": 0,
          "party_republican": 0,
          "party_nonpartisan": 0
      },
      ],
      []
    );
  
    const testcolumns = React.useMemo(
      () => [asTextColumn('county'), asNumberColumn('race_european'), asNumberColumn("race_asian"), asNumberColumn("race_african"), 
      asNumberColumn("race_hispanic"), asNumberColumn("race_other"),
      asNumberColumn("party_democrat"), asNumberColumn("party_republican"), asNumberColumn("party_nonpartisan"),],
      []
    );
    //console.log(stats);
    return (
    <div>
      <LineUpLite data={testdata} columns={testcolumns} features={features} />
    </div>
    )
  }

  export default LineUp;