import React from 'react'
import Auth from './pages/Auth'
import Consult from './pages/Consult'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Task from './components/Task'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import HealthPage from "./pages/HealthPage";
import TrackPage from "./pages/TrackPage";
import SelfPage from "./pages/SelfPage";
const App = () => {
  return (
   <BrowserRouter>
    <Routes>
      <Route path="/" element={<Auth/>}/>
      <Route path="/Login" element={<Login />}/>
      <Route path="/Register" element={<Register/>}/>
      <Route path="/Home" element={<Home />}/>
      <Route path="/Consult" element={<Consult/>}/>
      <Route path="/health" element={<HealthPage />} />
      <Route path="/track" element={<TrackPage />} />
      <Route path="/self" element={<SelfPage />} />
      
    </Routes>
   </BrowserRouter>
  )
}

export default App