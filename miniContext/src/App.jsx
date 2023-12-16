import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import UserContextProvider from './context/UserContextProvider'
import Login from './components/Login'
import Profile from './components/Profile'
 import './App.css'

function App() {
 

  return (
    <UserContextProvider>
        <h1>Context API</h1>
        <Login />
        <Profile />
    </UserContextProvider>
  )
}

export default App
      