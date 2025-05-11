import React, { useEffect, useRef, useState } from 'react';
import BpmnViewer from 'bpmn-js';
import { BPMNAssembler } from '../../bpmn-parsing/BPMNAssembler';
import { Statistics } from '../../simulation/Statistics';
import { SimulationEngine } from '../../simulation/SimulationEngine';
import {  BarChart,  Bar,  XAxis,  YAxis,  CartesianGrid,  Tooltip,  Legend,  Rectangle,  ResponsiveContainer,} from 'recharts';





export function View({ xml }) {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);


  const [diagram, setDiagram] = useState(null);  // Použití stavu pro diagram

    
    const [simulationRunning, setSimulationRunning] = useState(false);
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState({});


    useEffect(() => {
      if (!viewerRef.current) {
        viewerRef.current = new BpmnViewer({ container: containerRef.current });
      }
      
    
      if (xml) {
        viewerRef.current.importXML(xml).then(async () => {
          viewerRef.current.get('canvas').zoom('fit-viewport');
          const definitions = viewerRef.current.getDefinitions();
          window.bpmnDefinitions = definitions;
          const assembledDiagram = await BPMNAssembler.buildFromDefinitions(definitions, 'supermarket.xml');
          setDiagram(assembledDiagram);
        }).catch(err => {
          console.error('Chyba při načítání BPMN XML:', err);
        });

        
      }
    }, [xml]);

 



  const DisplayData = Object.entries(stats.activites || {}).map(
    ([activityID, info], index) => (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{info.name}</td>
        <td>{info.count}</td>
        <td>{info.percInstances.toFixed(2)}</td>

        <td>{Statistics.prepareValueForReading(info.minWholeDuration)}</td>
        <td>{Statistics.prepareValueForReading(info.maxWholeDuration)}</td>
        <td>{Statistics.prepareValueForReading(info.avgWholeDuration)}</td>

        <td>{Statistics.prepareValueForReading(info.minDuration)}</td>
        <td>{Statistics.prepareValueForReading(info.maxDuration)}</td>
        <td>{Statistics.prepareValueForReading(info.avgDuration)}</td>

        <td>{Statistics.prepareValueForReading(info.minDurationWithoutOfftime)}</td>
        <td>{Statistics.prepareValueForReading(info.maxDurationWithoutOfftime)}</td>
        <td>{Statistics.prepareValueForReading(info.avgDurationWithoutOfftime)}</td>

        <td>{Statistics.prepareValueForReading(info.minWaitingForExecution)}</td>
        <td>{Statistics.prepareValueForReading(info.maxWaitingForExecution)}</td>
        <td>{Statistics.prepareValueForReading(info.avgWaitingForExecution)}</td>

        <td>{info.minPrice.toFixed(2)}</td>
        <td>{info.maxPrice.toFixed(2)}</td>
        <td>{info.avgPrice.toFixed(2)}</td>
      </tr>
    )
  );

 

  const DisplayInstanceData = Object.entries(stats.instances || {})
  .filter(([key]) => key !== 'instances')
  .map(([key, value], index) => (
    <tr key={index}>
      <td>{key}</td>
      <td>{Statistics.convertInstancesValues(key,value,diagram)}</td>
    </tr>
  ));


  let barData;
  if (stats.instances === undefined) {
    barData = [];
  } else {
    barData = Array.from(stats.instances.instances.values());
  }


  return (
    <div>
      <div
        ref={containerRef}
        style={{ width: '90%', height: '400px', border: '1px solid #ccc' }}
      />  

      
    
    {stats.instances && Object.keys(stats.instances).length > 0 && (
      <div><h3>Statistiky instancí</h3>
        <div style={{ width: '90%', height: '300px', border: '1px solid #ccc' }}>
          
    <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={barData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="totalWholeDuration" fill="#8884d8" activeBar={<Rectangle fill="#4842b8" />} />
          <Bar dataKey="totalDuration" fill="#82ca9d" activeBar={<Rectangle fill="#33a65e"  />} />
          <Bar dataKey="totalDurationWithoutOfftime" fill="#cc5a52" activeBar={<Rectangle fill="#c4271b"  />} />
          <Bar dataKey="totalWaitingForExecution" fill="#cde069" activeBar={<Rectangle fill="#8ba11d"  />} />
        </BarChart>
      </ResponsiveContainer>
      </div>
      <div style={{ marginTop: '2rem' }}>
    
    <table className="table table-striped">
      <thead>
        <tr>
          <th>Info</th>
          <th>Údaj</th>
        </tr>
      </thead>
      <tbody>
        {DisplayInstanceData}
      </tbody>
    </table>
  </div>
</div>

        )}

      {stats.activites && Object.keys(stats.activites).length > 0 && (
  <div style={{ marginTop: '2rem' }}>
    <h3>Statistika aktivit</h3>
    <table className="table table-striped">
      <thead>
        <tr>
          <th rowSpan="2">#</th>
          <th rowSpan="2">Aktivita</th>
          <th rowSpan="2">Počet průchodů</th>
          <th rowSpan="2">% inst.</th>
          <th colSpan="3">Celkový čas</th>
          <th colSpan="3">Čas provádění</th>
          <th colSpan="3">Čas provádění bez offtime</th>
          <th colSpan="3">Čas čekání</th>
          <th colSpan="3">Cena</th>
        </tr>
        <tr>
          <th>Min</th>
          <th>Max</th>
          <th>Avg</th>
          <th>Min</th>
          <th>Max</th>
          <th>Avg</th>
          <th>Min</th>
          <th>Max</th>
          <th>Avg</th>
          <th>Min</th>
          <th>Max</th>
          <th>Avg</th>
          <th>Min</th>
          <th>Max</th>
          <th>Avg</th>
        </tr>
      </thead>
      <tbody>
        {DisplayData}
      </tbody>
    </table>
  </div>
)}


  
  
  


  

    </div>
  );

}