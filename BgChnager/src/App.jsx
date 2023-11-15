import { useState } from 'react'


function App() {
  const [color, setColor] = useState("olive")

  return (
    <div className='w-full h-screen duration-200' style={{backgroundColor:color}}>
      <div className='fixed flex flex-wrap justify-center bottom-12 inset-x-0 px-2'>
         <div className='flex flex-wrap justify-center gap-3 shadow-lr bg-white px-3 py-2 rounded-3xl'> 
         <button className='outline-none px-4 rounded-full ' onClick={()=> setColor("red")} style={{backgroundColor:"red"}}>red</button>
         <button className='outline-none px-4 rounded-full 'onClick={()=> setColor("blue")} style={{backgroundColor:"blue"}}>blue</button>
         <button className='outline-none px-4 rounded-full 'onClick={()=> setColor("green")} style={{backgroundColor:"green"}}>green</button>
         <button className='outline-none px-4 rounded-full 'onClick={()=> setColor("pink")} style={{backgroundColor:"pink"}}>pink</button>
         <button className='outline-none px-4 rounded-full 'onClick={()=> setColor("black")} style={{backgroundColor:"black"}}>black</button>
         <button className='outline-none px-4 rounded-full 'onClick={()=> setColor("white")} style={{backgroundColor:"white"}}>white</button>
         <button className='outline-none px-4 rounded-full 'onClick={()=> setColor("orange")} style={{backgroundColor:"orange"}}>orange</button>
         </div>
      </div>
    </div>
  )
}

export default App