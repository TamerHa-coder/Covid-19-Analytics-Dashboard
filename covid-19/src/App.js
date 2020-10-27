import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";
import {LineChart, Line, CartesianGrid, XAxis, YAxis, Legend, Tooltip} from "recharts";

function csvJSON(csv) {
  let lines = csv.split("\n");

  let result = [];

  let headers = lines[0].split(",");

  for (let i = 1; i < lines.length; i++) {
    let obj = {};
    let currentline = lines[i].split(",");

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j];
    }

    result.push(obj);
  }
  return result;
}

function getDateArr(arr) {
  if (arr.length > 1) {
    const country1 = arr[0]["Country/Region"],
      country2 = arr[1]["Country/Region"];
    return Object.keys(arr[0])
      .map((item) => {
        return {
          date: item,
          [country1]: Number(arr[0][item]),
          [country2]: Number(arr[1][item]),
        };
      })
      .slice(4);
  }
}

function App() {
  const [data, setData] = useState();
  const [c1, setC1] = useState();
  const [c2, setC2] = useState();

  useEffect(() => {
    const first = prompt("First Country:");
    const second = prompt("Second Country:");
    setC1(first);
    setC2(second);
    (async () => {
      const { data: dataFromChart } = await axios.get(
        "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv"
      );
      setData(
        getDateArr(
          csvJSON(dataFromChart).filter(
            (item) =>
              item["Country/Region"] === first || item["Country/Region"] === second
          )
        )
      );
    })();
  }, []);

  const renderLineChart = (
    <LineChart
      width={1000}
      height={500}
      data={data}
      margin={{ top: 5, right: 50, left: 70, bottom: 5 }}
    >
      <Line type="monotone" dataKey={c1} stroke="Orange" />
      <Line type="monotone" dataKey={c2} stroke="red" />
      <CartesianGrid stroke="#ccc" />
      <XAxis
        dataKey="date"
        label={{
          value: "Date",
          position: "insideBottomRight",
          dy: 20,
          fontSize: 25,
        }}
      />
      <YAxis
        type="number"
        label={{
          value: "Infected",
          position: "insideLeft",
          angle: -90,
          dx: -37,
          fontSize: 25,
        }}
      />
      <Legend />
      <Tooltip />
    </LineChart>
  );

  return (
    <div style={{ textAlign: "center", margin: "50px auto", width: "50%" }}>
      <h1>Covid-19 Chart</h1>
      {renderLineChart}
    </div>
  );
}

export default App;