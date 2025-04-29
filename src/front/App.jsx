
import React, { useState } from 'react';

import { Routes, Route } from 'react-router-dom';
import WithNavbar from "./layouts/WithNavbar";
import NoNavbar from "./layouts/NoNavbar";
import Home from './routes/Home';
import Chapter1 from './routes/Chapter1';
import Chapter3 from './routes/Chapter3';



function App() {


  /* PŘIDAT DO ROUTERU - <Route path="*" element={<NotFound />} />*/
  return (
    <>
      <Routes>
        
        
        
        <Route element={<WithNavbar />}>
          <Route path="bpmn-simulator/lesson-1" element={<Chapter1 />} />
          <Route path="bpmn-simulator/lesson-2" element={<Chapter1 />} />
          <Route path="bpmn-simulator/lesson-3" element={<Chapter3 />} />
          <Route path="bpmn-simulator/lesson-4" element={<Chapter1 />} />
        </Route>


      <Route element={<NoNavbar />}>
        <Route path="bpmn-simulator/" element={<Home />} />
      </Route>
        
        
      </Routes>
    </>
  );

}

export default App;
