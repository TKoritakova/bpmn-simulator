
import React, { useState } from 'react';
import { View } from '../bpmn-components/View';



export default function Chapter1() {
    const [bpmnXml, setBpmnXml] = useState(null);

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