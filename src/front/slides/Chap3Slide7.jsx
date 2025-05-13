import { useState, useEffect, useRef, useReducer } from "react";
import BpmnViewer from 'bpmn-js';
import { BPMNAssembler } from '../../bpmn-parsing/BPMNAssembler';
import { GeneralData } from "../components/stats/GeneralData";
import { Heatmap } from "../components/stats/Heatmap";
import { BPMNDiagram } from "../../model/BPMNDiagram";
import { ActivitiesData } from "../components/stats/ActivitiesData";

const LOCAL_KEY_STATS = "chapter3-default-simulation-stats";
const LOCAL_KEY_DIAGRAM = "chapter3-default-simulation-diagram";

export default function Chap3Slide7({ setSlideFinished }) {

  const containerWorkshopRef = useRef(null);
  const viewerWorkshopRef = useRef(null);
  const [diagram, setDiagram] = useState(null);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({});
  const [statsFirstSimulation, setStatsFirstSimulation] = useState({});
  const [diagramFirstSimulation, setDiagramFirstSimulation] = useState(null);
  const [, forceUpdate] = useReducer(x => x + 1, 0);


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


    const storedDiagram = localStorage.getItem(LOCAL_KEY_DIAGRAM);
    if (storedDiagram) setDiagramFirstSimulation(BPMNDiagram.fromSerializableObject(JSON.parse(storedDiagram)));
    const storedStats = localStorage.getItem(LOCAL_KEY_STATS);
    if (storedStats) setStatsFirstSimulation(JSON.parse(storedStats));


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

        setSlideFinished(prev => ({
          ...prev,
          [7]: true
        }));

        setSimulationRunning(false);
      };

      worker.onerror = (err) => {
        console.error('Worker selhal:', err);
        setSimulationRunning(false);
      };

    };

   

  const formatDateTimeLocal = (date) => {
    const pad = (n) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}


    const getWarehouse = () => {

      const gateway = diagram.getObjectByID("Gateway_VseNaskladneno");
      if (gateway) {
        const probability = gateway.getProbabilities().find(p => p.id === "Flow_VseNaskladneno_OpravitAutomobil");
        if (probability) {
          if (probability.probability >= 0.65) {
            return "High"
          } else if (probability.probability <= 0.35) {
            return "Low"
          } else {
            return "Middle"
          }
        }
      }
      return null;
    }
    



  const handleSubmit = (event) => {
    event.preventDefault();
    
  };


    return <div className="slide">
      
          {simulationRunning && (
        <div className="simulation-overlay">
          <p className="loading-dots">Simulace probíhá</p>
        </div>
      )}

      <div className='slide-h1-wrapper'><h1>Čtvrtá simulace: Začátek simulace</h1></div>
      <div className='slide-content-wrapper'>

      <div className='simulation-scenario-description-item'>
          <h2>Opakování</h2>
          <p><b>Začátek simulace</b> - <b>konkrétní datum a čas</b>, od kterého se simulace spustí. Má význam pro pracovní doby zdrojů, viz dále.</p>
          <p><b>Pracovní doby</b> - určují časy, v nichž zdroje pracují. Pracovních dob můžeme vytvořit několik a každé se nastavuje <b>jméno</b>, <b>první den práce v týdnu</b>, <b>poslední den práce v týdnu</b> a <b>dva časy</b>, mezi nimiž každý zdroj v jednom dni pracuje.</p>     
      </div>
       
      <div className='bpmn-diagram-wrapper'>
        <div
        ref={containerWorkshopRef}
        className='bpmn-diagram-supermarketver2'
        />
      </div>

       
      {!diagramFirstSimulation && !statsFirstSimulation && (
        <p className="explanation">Nejsou dostupné výsledky z první simulace. Pro pokračování výuky se nejprve vraťte na příslušnou obrazovku s první simulací a spusťte ji.</p>
      )}

      {diagram && diagramFirstSimulation && statsFirstSimulation && (
        <p className="explanation">V tomto cvičení je možné měnit čas začátku simulace. Jak je naznačeno v úvodu, čas začátku má na simulaci též vliv. Jednotlivé zdroje mají různě nastavenou pracovní dobu a spuštění simulace se začátkem v pondělí a v pátek může znamenat změny v časech čekání i provádění aktivit. Stejně tak simulaci ovlivňuje i hodina spuštění.<br /><br />Vybírání data je omezeno rokem 2000 - zvolený rok musí být větší nebo roven tomuto roku. V opačném případě se datum neuloží.</p>
      )}

    

      {diagram && diagramFirstSimulation && statsFirstSimulation && (<form onSubmit={handleSubmit} className="simulation-form">
        <div>
          <label htmlFor="instances">Počet instancí:</label>         
          <div><input type="text" id="instances" value={diagram.getNumberOfInstances()} disabled /></div>
        </div>
        <div><label htmlFor="arrivaldistribution">Rozdělení příchodů:</label>                   
        <div><select value={diagram.getArrivalDistribution()} id="arrivaldistribution" disabled>
            <option value="Fixed">Fixní</option>
            <option value="Exponential">Exponenciální</option>
            <option value="Normal">Normální</option>
          </select></div>
        </div>
        <div><label htmlFor="arrivalunit">Jednotka:</label>      
        <div><select value={diagram.getArrivalUnit()} id="arrivalunit" disabled>
              <option value="Second">Sekunda</option>
              <option value="Minute">Minuta</option>
              <option value="Hour">Hodina</option>
              <option value="Day">Den</option>
              <option value="Week">Týden</option>
            </select></div>       
        </div>
        <div><label htmlFor="arrivalmean">Průměrná (střední) hodnota:</label>         
        <div><input type="number" id="arrivalmean" value={diagram.getArrivalMean()} disabled /></div>
        </div>
        {diagram.getArrivalDistribution() == "Normal" && (<div><label htmlFor="arrivalstddeviation">Standardní odchylka:</label>         
          <div><input type="number" id="arrivalstddeviation" value={diagram.getArrivalStdDeviation()} disabled /></div>
        </div>)}
        <div>
          <label htmlFor="starttime">Začátek simulace:</label>         
          <div><input type="datetime-local" id="starttime" value={formatDateTimeLocal(diagram.getStartTime())} 
            onChange={(e) => {
              const value = e.target.value;              
              if (value) {
                const dateObj = new Date(value);
                if (dateObj.getFullYear() >= 2000) {
                  diagram.setStartTime(dateObj);
                  forceUpdate();
                } 
              }
            }}
          /></div>
        </div>
        <div><label htmlFor="currency">Měna simulace:</label>         
          <div><input type="text" id="currency" value={diagram.getCurrency() == "CZK" ? "Kč" : diagram.getCurrency()} disabled /></div>
        </div>
        <div><label htmlFor="warehouse">Skladové zásoby:</label>                   
          <div><select value={getWarehouse()} id="warehouse" disabled>
            <option value="Low">Nízké</option>
            <option value="Middle">Střední</option>
            <option value="High">Vysoké</option>
          </select></div>
        </div>
      <button onClick={runSimulation} disabled={simulationRunning}  type="submit" className="simulation-button">
        {simulationRunning ? 'Simulace běží...' : 'Spusť simulaci'}
      </button>
    </form>)}

    {stats.general && Object.keys(stats.general).length > 0 && (<div>
      <h2>Výsledky simulace</h2>
      <p className="explanation">Statistiky tentokrát obsahují pouze souhrnné informace, původní dvě heatmapy a statistiky aktivit. Spusťte simulaci s několika různými daty a časy a sledujte, jak se mění doby práce a čekání. Ovlivňuje zvolené datum začátku nějakým způsobem průběh instancí procesu? Čím to může být způsobeno?</p>
          <GeneralData stats={stats} diagram={diagram}/>
          <Heatmap stats={stats} diagram={diagram} file={'dilna-ver1.bpmn'}/>
          <ActivitiesData stats={stats} />
          </div>
)}

{stats.general && Object.keys(stats.general).length > 0 && (<div>
      <h2>Výsledky první simulace</h2>
      <p className="explanation">Níže se nachází statistiky z první simulace, konkrétně jejího posledního spuštění, pro porovnání s daty z pozměněného scénáře.</p>
          <GeneralData stats={statsFirstSimulation} diagram={diagramFirstSimulation}/>
          <Heatmap stats={statsFirstSimulation} diagram={diagramFirstSimulation} file={'dilna-ver1.bpmn'}/>
          <ActivitiesData stats={statsFirstSimulation} />
          </div>
)}



    </div>

    
    </div>
    ;
}