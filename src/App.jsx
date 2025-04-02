
import './App.css'
import React, { useState } from 'react';

import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/NavBar';
import Home from './routes/Home';
import Chapter1 from './routes/Chapter1';


function App() {


  /* PŘIDAT DO ROUTERU - <Route path="*" element={<NotFound />} />*/
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="bpmn-simulator/" element={<Home />} />
        <Route path="bpmn-simulator/lesson-1" element={<Chapter1 />} />
        
        
      </Routes>
    </>
  );

}

export default App;
