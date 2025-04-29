

import React, { useEffect, useState } from 'react';
import { View } from '../components/View';




export default function Chapter1() {
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

  

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const text = await file.text();
    setBpmnXml(text);
  };



  return (
    <div>
      <h1>BPMN Viewer</h1>

      {/* Tlačítko pro nahrání nového BPMN souboru */}
      <input type="file" accept=".bpmn,.xml" onChange={handleFileChange} />

      {/* Pokud máme XML, zobrazíme komponentu View pro vykreslení diagramu */}
      {bpmnXml && <View xml={bpmnXml} />}

      
    </div>
  );

  }