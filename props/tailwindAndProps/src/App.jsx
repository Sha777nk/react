import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Card from './components/Card'

function App() {
  const [count, setCount] = useState(0)
  let myObj={
    username:"Shashank",
    age:21
  }

  return (
    <>
   <Card channel="Shashank" paraText="Life is short Live it large ,this is said by the man who only lived for 104 years ha ha ha  " />
   <Card channel="Willam echand" paraText="Whatever he says "/>

    </>
  )
}

export default App
