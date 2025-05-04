

import React, { useEffect, useState } from 'react';
import { View } from '../components/View';

/*https://recharts.org/en-US/examples/SimpleBarChart*/


export default function Chapter3() {
    const [bpmnXml, setBpmnXml] = useState(null);


    useEffect(() => {
        fetch('supermarket.bpmn') 
          .then(res => res.text())
          .then(text => {
            setBpmnXml(text);
          })
          .catch(err => {
            console.error('Chyba při načítání výchozího BPMN souboru:', err);
          });

          
      }, []);

  


  return (
    <div className='test'>
      <h1>Simulace</h1>


      {bpmnXml && <View xml={bpmnXml} />}

      
    </div>
  );

  }