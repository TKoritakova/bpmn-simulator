import { useState, useEffect, useRef } from "react";
import BpmnViewer from 'bpmn-js';
import { BPMNAssembler } from '../../bpmn-parsing/BPMNAssembler';
import { Statistics } from '../../simulation/Statistics';
import { SimulationEngine } from '../../simulation/SimulationEngine';

export default function Chap3Slide4({ setSlideFinished }) {

  const containerWorkshopRef = useRef(null);
  const viewerWorkshopRef = useRef(null);
  const [diagram, setDiagram] = useState(null);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetch('dilna-ver1.bpmn') 
    .then(res => res.text())
    .then(text => {
      
      if (!viewerWorkshopRef.current) {
        viewerWorkshopRef.current = new BpmnViewer({ container: containerWorkshopRef.current });
      }
      viewerWorkshopRef.current.importXML(text).then(async () => {
        viewerWorkshopRef.current.get('canvas').zoom('fit-viewport'); 
        const definitions = viewerWorkshopRef.current.getDefinitions();    
        const assembledDiagram = await BPMNAssembler.buildFromDefinitions(definitions, 'dilna-ver1-scenario1.xml');
        setDiagram(assembledDiagram);   
        console.log(assembledDiagram);            
                  
      }).catch(err => {
          console.error('Chyba při načítání BPMN XML:', err);
      });
    })
    .catch(err => {
    console.error('Chyba při načítání BPMN souboru:', err);
    });


  }, []);

  const runSimulation = async () => {
      setSimulationRunning(true); 
    
      console.log("sim start")
      const engine = new SimulationEngine(diagram);
    
      await engine.run();
      console.log("sim stats")
      setLogs(engine.log);
    
      const statistics = Statistics.createStatistics(engine.log, diagram);
      setStats(statistics);
  
      console.log("sim end")
    
      setSimulationRunning(false);
    };

    return <div className="slide">
      <div className='slide-h1-wrapper'><h1>První simulace</h1></div>
      <div className='slide-content-wrapper'>
       

      <div className='bpmn-diagram-wrapper'>
        <div
        ref={containerWorkshopRef}
        className='bpmn-diagram-supermarketver2'
        />
      </div>
          
      <button onClick={runSimulation} disabled={simulationRunning}>
        {simulationRunning ? 'Simulace běží...' : 'Simuluj'}
      </button>

      </div>   
    </div>
    ;
}