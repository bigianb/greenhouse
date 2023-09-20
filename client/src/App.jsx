import axios from "axios";
import { useEffect, useState } from "react";
import { lightFormat, parse } from 'date-fns'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

import './App.css'

const server = 'http://greenhouse:3000'


function parseCSV(data)
{
  return data.split('\n').filter(line => line.trim().length > 0).map(line => {
    const els = line.trim().split(',');
    const obj = {}
    // 20230904-003646
    obj.dateTime = parse(els[0], 'yyyyMMdd-HHmmss', new Date(2010, 0, 1));
    obj.val = Number(els[1]);
    return obj;
  });
}

function App() {
  
  const [currentData, setCurrentData] = useState(null)
  const [moistureData, setCurrentMoistureData] = useState([])
  const [temperatureData, setCurrentTemperatureData] = useState([])
  const [humidityData, setCurrentHumidityData] = useState([])

  useEffect(() => {
    axios
      .get(server + "/data/current_readings.json")
      .then((result) => {
        setCurrentData(result.data);
      })
      .catch((error) => console.log(error));
  }, []);

  const dateString = lightFormat(new Date(), 'yyyyMMdd');

  console.log(dateString);

  useEffect(() => {
    axios
      .get(`${server}/data/moisture0_${dateString}.csv`)
      .then((result) => {
        setCurrentMoistureData(parseCSV(result.data));
      })
      .catch((error) => console.log(error));
  }, [dateString]);

  useEffect(() => {
    axios
      .get(`${server}/data/temperature_${dateString}.csv`)
      .then((result) => {
        setCurrentTemperatureData(parseCSV(result.data));
      })
      .catch((error) => console.log(error));
  }, [dateString]);

  useEffect(() => {
    axios
      .get(`${server}/data/humidity_${dateString}.csv`)
      .then((result) => {
        setCurrentHumidityData(parseCSV(result.data));
      })
      .catch((error) => console.log(error));
  }, [dateString]);

  if (!currentData){
    return 'Loading...'
  }

  const moistureChartData = {
    labels: moistureData.map(el => lightFormat(el.dateTime, 'HH-mm')),
    datasets: [
      {
        label: 'Moisture',
        data: moistureData.map(el => el.val / 100),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ],
  };

  const moistureOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Moisture',
      },
    },
  };

  const temperatureChartData = {
    labels: temperatureData.map(el => lightFormat(el.dateTime, 'HH-mm')),
    datasets: [
      {
        label: 'Temperature',
        data: temperatureData.map(el => el.val),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ],
  };

  const temperatureOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Temperature',
      },
    },
  };

  const humidityChartData = {
    labels: humidityData.map(el => lightFormat(el.dateTime, 'HH-mm')),
    datasets: [
      {
        label: 'Humidity',
        data: humidityData.map(el => el.val),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ],
  };

  const humidityOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Humidity',
      },
    },
  };

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

        <Line options={moistureOptions} data={moistureChartData} />
        <Line options={temperatureOptions} data={temperatureChartData} />
        <Line options={humidityOptions} data={humidityChartData} />

      </div>
  )
}

export default App
