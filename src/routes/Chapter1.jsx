

import React, { useEffect, useState } from 'react';
import { View } from '../components/View';
import { BPMNAssembler } from '../bpmn-parsing/BPMNAssembler';



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
      <input type="file" accept=".bpmn,.xml" onChange={handleFileChange} />
      {bpmnXml && <View xml={bpmnXml} />}
    </div>
  );

  }