import { useState, useEffect, useRef, useReducer } from "react";
import BpmnViewer from 'bpmn-js';
import { BPMNAssembler } from '../../bpmn-parsing/BPMNAssembler';
import { Heatmap } from "../components/stats/Heatmap";
import { ActivitiesData } from "../components/stats/ActivitiesData";
import { FinalSimulationForm } from "../components/FinalSimulationForm";
import { GeneralDataWithWeeklyCosts } from "../components/stats/GeneralDataWithWeeklyCosts";
import { HeatmapIterations } from "../components/stats/HeatmapIterations";
import { ResourceUtilization } from "../components/stats/ResourceUtilization";


export default function Chap4Slide1({ setSlideFinished }) {

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

    const worker = new Worker(
      new URL('../../workers/simulationWorker.js', import.meta.url), // přizpůsob cestu!
      { type: 'module' }
    );


    // Odešli serializovaný diagram
    worker.postMessage({
      diagramData: diagram.toSerializableObject()
    });

    // Získání výsledku
    worker.onmessage = (event) => {
      const { log, stats, error } = event.data;

      if (error) {
        console.error('Chyba ze simulace:', error);
        setSimulationRunning(false);
        return;
      }

      setLogs(log);
      setStats(stats);


      setSimulationRunning(false);
    };

    worker.onerror = (err) => {
      console.error('Worker selhal:', err);
      setSimulationRunning(false);
    };

  };


  return <div className="slide">
    
    {simulationRunning && (
      <div className="simulation-overlay">
        <p className="loading-dots">Simulace probíhá</p>
      </div>
    )}

    <div className='slide-h1-wrapper'><h1>Závěrečný úkol</h1></div>
    <div className='slide-content-wrapper'>

      <p className="explanation">DOPSAT</p>
      
      <div className='bpmn-diagram-wrapper'>
        <div
        ref={containerWorkshopRef}
        className='bpmn-diagram-supermarketver2'
        />
      </div>

      <h2>Volba vstupních parametrů</h2>

      {diagram && (
        <FinalSimulationForm diagram={diagram} />
      )}

      {diagram && (       
        <button onClick={runSimulation} disabled={simulationRunning} className="simulation-button">
          {simulationRunning ? 'Simulace běží...' : 'Spusť simulaci'}
        </button>
      )}

      {stats.general && Object.keys(stats.general).length > 0 && (
        <div>
          <h2>Výsledky simulace</h2>
          <p className="explanation">--</p>
          <GeneralDataWithWeeklyCosts stats={stats} diagram={diagram}/>
          <ResourceUtilization stats={stats} diagram={diagram}/>
          <Heatmap stats={stats} diagram={diagram} file={'dilna-ver1.bpmn'}/>
          <HeatmapIterations stats={stats} file={'dilna-ver1.bpmn'} />
          <ActivitiesData stats={stats} />
        </div>
      )}
    </div>

    
  </div>;
}