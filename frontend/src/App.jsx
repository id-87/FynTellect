import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Login from './components/Login'
import Signup from './components/Signup'
import Navbar from './components/Navbar'
import Transactions from './components/Transactions'
import Home from './components/Home'
import Configuration from './components/Configuration'
import Alert from './components/Alert'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path='/home' element={<Home/>}/>
          <Route path='/transactions' element={<Transactions/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/config' element={<Configuration/>}/>
          <Route path='/alert' element={<Alert/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
