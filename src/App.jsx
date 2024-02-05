import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Biography from './components/biography/Biography';
import Aboutsection from './components/Aboutsection';
import Activitysection from './components/Activitysection';
import Blogsection from './components/Blogsection';
import HeroSection from './components/Herosection';
import Home from './Home';
import Login from './Login/Login';
import Cookies from 'universal-cookie'
import {jwtDecode} from 'jwt-decode';
import { useToken } from './Context/Tokencontext';

function App() {
  const nav=useNavigate()

  const { getverified } = useToken()

  const cookies = new Cookies()


  useEffect(()=>{
    getverified()
  },[])
  
  
  
  return (
    <div>

      <Routes>
        <Route path="/login" element={<Login />} /> 
          <Route path="/home" element={<Home />} />
            <Route path="/edit/aboutsection" element={<Aboutsection />} />
            <Route path="/edit/blogsection" element={<Blogsection />} />
            <Route path="/edit/biography" element={<Biography />} />
            <Route path="/edit/activity" element={<Activitysection />} />
            <Route path="/edit/herosection" element={<HeroSection />} />
      </Routes>
    </div>
  );
}

export default App;
