
import React, { useState, useEffect } from 'react';

import { Routes, Route } from 'react-router-dom';
import WithNavbar from "./layouts/WithNavbar";
import NoNavbar from "./layouts/NoNavbar";
import Home from './routes/Home';
import SiteNotFound from './routes/SiteNotFound';
import Chapter1 from './routes/Chapter1';
import Chapter2 from './routes/Chapter2';
import Chapter3 from './routes/Chapter3';

const LOCAL_KEY_CHAP1_SUBMITTED = "chapter1-test-submitted";
const LOCAL_KEY_CHAP2_SUBMITTED = "chapter2-test-submitted";
const LOCAL_KEY_CHAP3_SUBMITTED = "chapter3-test-submitted";

function App() {


  return (
    <>
      <Routes>
        
        
        
        <Route element={<WithNavbar />}>
         
          <Route path="bpmn-simulator/lesson-1" element={<Chapter1 />} />

          <Route path="bpmn-simulator/lesson-2" element={<Chapter2 />} />

          <Route path="bpmn-simulator/lesson-3" element={<Chapter3 />} />
          
          <Route path="bpmn-simulator/lesson-4" element={<Chapter1 />} />
          
        </Route>


      <Route element={<NoNavbar />}>
        <Route path="bpmn-simulator/" element={<Home />} />
        <Route path="*" element={<SiteNotFound />} />
      </Route>
        
        
      </Routes>
    </>
  );

}

export default App;
