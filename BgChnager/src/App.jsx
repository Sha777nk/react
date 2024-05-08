import { useState } from 'react'


// export default function App() {
  
  //   return (
    //     <div className='w-full h-screen duration-200' style={{backgroundColor:color}}>
    //       <div className='fixed flex flex-wrap justify-center bottom-12 inset-x-0 px-2'>
    //          <div className='flex flex-wrap justify-center gap-3 shadow-lr bg-white px-3 py-2 rounded-3xl'> 
    //          <button className='outline-none px-4 rounded-full ' onClick={()=> setColor("red")} style={{backgroundColor:"red"}}>red</button>
    //          <button className='outline-none px-4 rounded-full 'onClick={()=> setColor("blue")} style={{backgroundColor:"blue"}}>blue</button>
    //          <button className='outline-none px-4 rounded-full 'onClick={()=> setColor("green")} style={{backgroundColor:"green"}}>green</button>
    //          <button className='outline-none px-4 rounded-full 'onClick={()=> setColor("pink")} style={{backgroundColor:"pink"}}>pink</button>
    //          <button className='outline-none px-4 rounded-full 'onClick={()=> setColor("black")} style={{backgroundColor:"black"}}>black</button>
    //          <button className='outline-none px-4 rounded-full 'onClick={()=> setColor("white")} style={{backgroundColor:"white"}}>white</button>
    //          <button className='outline-none px-4 rounded-full 'onClick={()=> setColor("orange")} style={{backgroundColor:"orange"}}>orange</button>
    //          </div>
    //       </div>
    //     </div>
    //   )
    // }
    
    // // export default App
    
    import * as d3 from "d3";
    import { useRef, useEffect } from "react";
    
    export default function LinePlot({
      data,
      width = 640,
      height = 400,
      marginTop = 20,
      marginRight = 20,
      marginBottom = 30,
      marginLeft = 40
    }) {
  const [color, setColor] = useState("olive")
  var data =[8.6,8.82,9.2,8.9,8.96];
  const gx = useRef();
  const gy = useRef();
  const x = d3.scaleLinear().domain([0, data.length - 1]).range([marginLeft, width - marginRight]);
  const y = d3.scaleLinear().domain(d3.extent(data)).range([height - marginBottom, marginTop]);
  const line = d3.line().x((d, i) => x(i)).y(y);
  useEffect(() => {
    d3.select(gx.current).call(d3.axisBottom(x).ticks(data.length));
  }, [gx, x, data.length]);
  useEffect(() => {
    d3.select(gy.current).call(d3.axisLeft(y));
  }, [gy, y]);
  return (
    <div className='w-full h-screen duration-200 flex justify-center items-center' style={{ backgroundColor: color }}>
      <svg width={width} height={height}>
        <g ref={gx} transform={`translate(0,${height - marginBottom})`} />
        <g ref={gy} transform={`translate(${marginLeft},0)`} />
        <path fill="none" stroke="currentColor" strokeWidth="1.5" d={line(data)} />
        <g fill="currentColor">
          {data.map((d, i) => (
            <circle key={i} cx={x(i)} cy={y(d)} r="2.5" />
          ))}
        </g>
      </svg>
      <div className='fixed flex flex-wrap justify-center bottom-12 inset-x-0 px-2'>
        <div className='flex flex-wrap justify-center gap-3 shadow-lr bg-white px-3 py-2 rounded-3xl'>
          <button className='outline-none px-4 rounded-full' onClick={() => setColor("red")} style={{ backgroundColor: "red" }}>red</button>
          <button className='outline-none px-4 rounded-full' onClick={() => setColor("blue")} style={{ backgroundColor: "blue" }}>blue</button>
          <button className='outline-none px-4 rounded-full' onClick={() => setColor("green")} style={{ backgroundColor: "green" }}>green</button>
          <button className='outline-none px-4 rounded-full' onClick={() => setColor("pink")} style={{ backgroundColor: "pink" }}>pink</button>
          <button className='outline-none px-4 rounded-full' onClick={() => setColor("black")} style={{ backgroundColor: "black" }}>black</button>
          <button className='outline-none px-4 rounded-full' onClick={() => setColor("white")} style={{ backgroundColor: "white" }}>white</button>
          <button className='outline-none px-4 rounded-full' onClick={() => setColor("orange")} style={{ backgroundColor: "orange" }}>orange</button>
        </div>
      </div>
    </div>
  );
}
