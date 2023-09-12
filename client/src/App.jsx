import axios from "axios";
import React, { useEffect, useState } from "react";
import './App.css'

const server = 'http://greenhouse:3000'

function App() {
  const [count, setCount] = useState(0)

  const [currentData, setCurrentData] = useState(null)

  useEffect(() => {
    axios
      .get(server + "/data/current_readings.json")
      .then((result) => {
        setCurrentData(result.data);
      })
      .catch((error) => console.log(error));
  }, []);

  if (!currentData){
    return 'Loading...'
  }

  /*
  {
    "time": "Sun Sep 10 23:04:47 2023",
    "temperature": 26.22,
    "relative_humidity": 60.54,
    "moisture": 11551
}*/
  return (
      <div>
        <ul>
          <li>Time: {currentData.time}</li>
          <li>Temperature: {currentData.temperature}</li>
          <li>Humidity: {currentData.relative_humidity}</li>
          <li>Moisture: {currentData.moisture}</li>
        </ul>
      </div>
  )
}

export default App
