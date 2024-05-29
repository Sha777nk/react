import * as d3 from "d3";
import { useRef, useEffect, useState } from "react";
import axios from "axios"; // Import Axios for making HTTP requests

export default function LinePlot({
  width = 640,
  height = 400,
  marginTop = 20,
  marginRight = 20,
  marginBottom = 30,
  marginLeft = 40,
}) {
  const [plotData, setPlotData] = useState([]); // Initialize plotData with an empty array

  const gx = useRef();
  const gy = useRef();

  const x = d3.scaleLinear().range([marginLeft, width - marginRight]).domain([0, 9]); // Set the domain from 0 to 9 for 10 data points
  const y = d3.scaleLinear().nice().range([height - marginBottom, marginTop]).domain([0, 100000]); // Set the domain from 0 to 5 with class interval of 0.1

  const lineBytesSent = d3.line()
    .x((_, i) => x(i))
    .y((d) => y(d.tx_sec)); // Define the line function for bytes sent

  const lineBytesReceived = d3.line()
    .x((_, i) => x(i))
    .y((d) => y(d.rx_sec)); // Define the line function for bytes received

  useEffect(() => {
    // Fetch data initially
    fetchData();

    // Fetch data every second
    const interval = setInterval(fetchData, 1000);

    // Cleanup function to clear interval when component unmounts
    return () => clearInterval(interval);
  }, []);

  const fetchData = () => {
    axios.get("http://localhost:3000/history")
      .then(response => {
        const rawData = response.data;
        const formattedData = Object.values(rawData).flatMap(network => network.stats);
        setPlotData(formattedData.slice(-10)); // Update plotData with the last 10 data points
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  };
  
  useEffect(() => void d3.select(gx.current).call(d3.axisBottom(x)), [gx, x]);
  useEffect(() => void d3.select(gy.current).call(d3.axisLeft(y).tickValues(d3.range(0, 1000000, 10000))), [gy, y]); // Update tick values to range from 0 to 5 with a step of 0.1

  useEffect(() => {
    // Update the domain of the scales when plotData changes
    x.domain([0, plotData.length - 1]);

  }, [plotData, x]);

  return (
    <div className="card-container p-6 rounded-lg shadow-lg bg-white">
      <h1 className="text-2xl font-bold mb-4">Graphical representation of bytes sent and received</h1>
      <svg width={width} height={height}>
        <g ref={gx} transform={`translate(0,${height - marginBottom})`} />
        <g ref={gy} transform={`translate(${marginLeft},0)`} />
        <path fill="none" stroke="blue" strokeWidth="1.5" d={lineBytesSent(plotData)} />
        <path fill="none" stroke="yellow" strokeWidth="1.5" d={lineBytesReceived(plotData)} />
        {/* Indicator for bytes sent */}
        <rect x={width - marginRight - 50} y={10} width={10} height={10} fill="blue" />
        <text x={width - marginRight - 35} y={20} fontSize="10" fill="black">Incoming Bytes/sec</text>
        {/* Indicator for bytes received */}
        <rect x={width - marginRight - 50} y={25} width={10} height={10} fill="yellow" />
        <text x={width - marginRight - 35} y={35} fontSize="10" fill="black">Outgoing Bytes/sec</text>
        {/* Circles for plotData */}
        <g fill="blue" stroke="currentColor" strokeWidth="1.5">
          {plotData.map((d, i) => (
            <circle key={i} cx={x(i)} cy={y(d.tx_sec)} r="2.5" />
          ))}
        </g>
        <g fill="yellow" stroke="currentColor" strokeWidth="1.5">
          {plotData.map((d, i) => (
            <circle key={i} cx={x(i)} cy={y(d.rx_sec)} r="2.5" />
          ))}
        </g>
      </svg>
    </div>
  );
}
