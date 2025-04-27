import React, { useEffect, useRef, useState } from 'react';
import BpmnViewer from 'bpmn-js';
import { BPMNAssembler } from '../bpmn-parsing/BPMNAssembler';
import { BPMNSimulator } from '../simulation/BPMNSimulator';
import { SimulationEngine } from '../simulation/SimulationEngine';
import { Chart } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  TimeScale,
  BarElement,
  Tooltip,
  Legend,
  CategoryScale
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(LinearScale, TimeScale, CategoryScale, BarElement, Tooltip, Legend);

export function View({ xml }) {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);

  const [steps, setSteps] = useState(15);  // Počet kroků pro simulaci
  const [diagram, setDiagram] = useState(null);  // Použití stavu pro diagram
  const [simulator, setSimulator] = useState(null);
    
    const [simulationRunning, setSimulationRunning] = useState(false);
    const [logs, setLogs] = useState([]);


  useEffect(() => {
    if (!viewerRef.current) {
      viewerRef.current = new BpmnViewer({
        container: containerRef.current,
      });
    }

    if (xml) {
      viewerRef.current.importXML(xml).then(() => {
        
        viewerRef.current.get('canvas').zoom('fit-viewport');

        const definitions = viewerRef.current.getDefinitions();
        
       

        // Uložení definic a diagramu do stavu
        window.bpmnDefinitions = definitions;
        const assembledDiagram = BPMNAssembler.buildFromDefinitions(definitions, 'supermarket.xml');
        setDiagram(assembledDiagram); // Uložení diagramu do stavu

        // Inicializace simulátoru
        setSimulator(new BPMNSimulator(steps));
      }).catch(err => {
        console.error('Chyba při načítání BPMN XML:', err);
      });
    }
  }, [xml]);

  const runSimulation = async () => {
    const resource = {
      isAvailable: true,
      id: 'res1'
    };

    const resource2 = {
      isAvailable: true,
      id: 'res2'
    };

    const engine = new SimulationEngine();

    engine.addResource(resource, 'pokus_id');
    engine.addResource(resource2, 'pokus_id');

    diagram.getAllObjects().forEach(element => {
      if (element.constructor.name === "Event" && element.type === "start") {
        engine.addWorkItemToQueue(element, 'pokus_id', 1);  
        engine.addWorkItemToQueue(element, 'pokus_id', 2);
      }
    });

    await engine.run();
    setLogs(engine.log);

    /*if (diagram && simulator) {
      setSimulationRunning(true);

      // Spuštění simulace
      simulator.startSimulation(diagram, (stepsExecuted) => {
        console.log(`Aktuální počet kroků: ${stepsExecuted}`);
      });
    } else {
      console.log('Diagram nebo simulátor nejsou připraveny');
    }*/
  };

  const getChartData = () => {

      return {
        datasets: logs.map((log, index) => ({
          label: `${log.taskId} (Instance ${log.instaceID})`,
          data: [{
            x: log.startedAt,
            x2: log.finishedAt,
            y: `Instance ${log.instaceID}`,
            name: log.taskId
          }],
          backgroundColor: `hsl(${(log.instaceID * 80 + index * 15) % 360}, 70%, 60%)`,
          borderColor: 'rgba(0, 0, 0, 0.3)',
          borderWidth: 1,
        }))
      };
    
}


  return (
    <div>
      <div
        ref={containerRef}
        style={{ width: '100%', height: '600px', border: '1px solid #ccc' }}
      />

      <button onClick={runSimulation} disabled={simulationRunning}>
        {simulationRunning ? 'Simulace běží...' : 'Simuluj'}
      </button>

      <div>
        <label htmlFor="steps">Počet kroků:</label>
        <input
          id="steps"
          type="number"
          value={steps}
          onChange={(e) => setSteps(parseInt(e.target.value, 10))}
          min="1"
        />
      </div>

      {logs.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Průběh simulace podle instance</h3>
          <Chart
            type="bar"
            data={getChartData()}
            options={{
              indexAxis: 'y',
              parsing: {
                xAxisKey: 'x',
                x2AxisKey: 'x2',
                yAxisKey: 'y',
              },
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
                tooltip: {
                  callbacks: {
                    label: context => {
                      const start = context.raw.x;
                      const end = context.raw.x2;
                      const name = context.raw.name;
                      return `Aktivita: ${name}, Od: ${start}, Do: ${end}`;
                    },
                  },
                },
              },
              scales: {
                x: {
                  type: 'linear',
                  title: {
                    display: true,
                    text: 'Čas'
                  },
                  beginAtZero: true
                  
                },
                y: {
                  type: 'category',
                  title: {
                    display: true,
                    text: 'Instance'
                  },
                  ticks: {
                    autoSkip: false
                  },
                  offset: true
                }
              }
            }}
          />
        </div>
      )}
    </div>
  );

}