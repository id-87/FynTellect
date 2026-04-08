import { useState } from 'react'
import ProtectedRoute from './components/ProtectedRoutes'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './global.css'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Login from './components/Login'
import Signup from './components/Signup'
import Navbar from './components/Navbar'
import Transactions from './components/Transactions'
import Home from './components/Home'
import Chat from './components/Chat'
import AccountAggregator from './components/AccountAggregator'
import Configuration from './components/Configuration'
import Alert from './components/Alert'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path='/home' element={<ProtectedRoute><Home/></ProtectedRoute>}/>
          <Route path='/transactions' element={<ProtectedRoute><Transactions/></ProtectedRoute>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/config' element={<ProtectedRoute><Configuration/></ProtectedRoute>}/>
          <Route path='/alert' element={<ProtectedRoute><Alert/></ProtectedRoute>}/>
          <Route path='/agent' element={<ProtectedRoute><Chat/></ProtectedRoute>}/>
          <Route path='/aa' element={<ProtectedRoute><AccountAggregator/></ProtectedRoute>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
