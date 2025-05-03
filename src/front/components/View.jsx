import React, { useEffect, useRef, useState, PureComponent } from 'react';
import BpmnViewer from 'bpmn-js';
import { BPMNAssembler } from '../../bpmn-parsing/BPMNAssembler';
import { Statistics } from '../../simulation/Statistics';
import { SimulationEngine } from '../../simulation/SimulationEngine';
import {  BarChart,  Bar,  XAxis,  YAxis,  CartesianGrid,  Tooltip,  Legend,  Rectangle,  ResponsiveContainer,} from 'recharts';


function colorizeDiagram(viewer, stats, type = 'execution') {
  let overlays = viewer.get('overlays');
  let elementRegistry = viewer.get('elementRegistry');
  
  let getValue = (info) => {
    if (type === 'execution') {
      return info.avgDurationWithoutOfftime;
    } else if (type === 'waiting') {
      return info.avgWaitingForExecution;
    } else {
      return 0;
    }
  };

 

  for (const [id, info] of Object.entries(stats.activites || {})) {

    let shape = elementRegistry.get(id);
    if (shape) {
      const value = getValue(info);
      const overlayHtml = document.createElement('div');


      overlayHtml.className = 'highlight-overlay-green';

      if (value > 3600) {
        overlayHtml.className = 'highlight-overlay-red';
      } else if (value > 1800) {
        overlayHtml.className = 'highlight-overlay-orange';
      } else if (value > 600) {
        overlayHtml.className = 'highlight-overlay-yellow';
      } else {
        overlayHtml.className = 'highlight-overlay-green';
      }

      overlayHtml.style.width = shape.width + 'px';
      overlayHtml.style.height = shape.height + 'px';

      overlays.add(id, {
        position: {
          top: 0,
          left: 0
        },
        html: overlayHtml
      });
    }

}
}


export function View({ xml }) {
  const containerRef = useRef(null);
  const executionContainerRef = useRef(null);    
  const waitingContainerRef = useRef(null); 
  const viewerRef = useRef(null);
  const executionViewerRef = useRef(null);
  const waitingViewerRef = useRef(null);

  const [diagram, setDiagram] = useState(null);  // Použití stavu pro diagram

    
    const [simulationRunning, setSimulationRunning] = useState(false);
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState({});


    useEffect(() => {
      if (!viewerRef.current) {
        viewerRef.current = new BpmnViewer({ container: containerRef.current });
      }
      if (!executionViewerRef.current) {
        executionViewerRef.current = new BpmnViewer({ container: executionContainerRef.current });
      }
      if (!waitingViewerRef.current) {
        waitingViewerRef.current = new BpmnViewer({ container: waitingContainerRef.current });
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

        executionViewerRef.current.importXML(xml).then(async () => {
          executionViewerRef.current.get('canvas').zoom('fit-viewport');        
        }).catch(err => {
          console.error('Chyba při načítání BPMN XML:', err);
        });

        waitingViewerRef.current.importXML(xml).then(async () => {
          waitingViewerRef.current.get('canvas').zoom('fit-viewport');        
        }).catch(err => {
          console.error('Chyba při načítání BPMN XML:', err);
        });
      }
    }, [xml]);

 

  const runSimulation = async () => {
    setSimulationRunning(true); 
  
    const engine = new SimulationEngine(diagram);
  
    await engine.run();
    
    setLogs(engine.log);
  
    const statistics = Statistics.createStatistics(engine.log, diagram);
    setStats(statistics);

    if (executionContainerRef.current && waitingContainerRef.current) {
      
      
  
      colorizeDiagram(executionViewerRef.current, statistics, 'execution');
      colorizeDiagram(waitingViewerRef.current, statistics, 'waiting');
    }
  
    setSimulationRunning(false);
  };


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

  const DisplayGeneralData = Object.entries(stats.general || {}).map(
    ([key, value], index) => (
      <tr key={index}>
        <td>{Statistics.convertGeneralDescriptions(key)}</td>
        <td>{Statistics.convertGeneralValues(key,value,diagram)}</td>
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

      <button onClick={runSimulation} disabled={simulationRunning}>
        {simulationRunning ? 'Simulace běží...' : 'Simuluj'}
      </button>

      

      {stats.general && Object.keys(stats.general).length > 0 && (
  <div style={{ marginTop: '2rem' }}>
    <h3>General info</h3>
    <table className="table table-striped">
      <thead>
        <tr>
          <th>Info</th>
          <th>Údaj</th>
        </tr>
      </thead>
      <tbody>
        {DisplayGeneralData}
      </tbody>
    </table>
  </div>
)}
    
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

  
  <div >
    <table style={{ width: '90%'}}>
      <tbody>
      <tr>
        <td><h3>Heatmapa - čas provádění</h3></td>
        <td><h3>Heatmapa - čekací doby</h3></td>
      </tr>
      <tr>
        <td><div ref={executionContainerRef} style={{ width: '90%', height: '300px', border: '1px solid #ccc' }} /></td>
        <td><div ref={waitingContainerRef} style={{ width: '90%', height: '300px', border: '1px solid #ccc' }} /></td>
      </tr>
      </tbody>
    </table>
    </div>
  
  
  


  

    </div>
  );

}