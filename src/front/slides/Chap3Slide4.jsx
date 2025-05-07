import { useState, useEffect, useRef, useReducer } from "react";
import BpmnViewer from 'bpmn-js';
import { BPMNAssembler } from '../../bpmn-parsing/BPMNAssembler';
import { Statistics } from '../../simulation/Statistics';
import { SimulationEngine } from '../../simulation/SimulationEngine';
import { GeneralData } from "../components/stats/GeneralData";

export default function Chap3Slide4({ setSlideFinished }) {

  const containerWorkshopRef = useRef(null);
  const viewerWorkshopRef = useRef(null);
  const [diagram, setDiagram] = useState(null);
  const [diagram2, setDiagram2] = useState(null);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({});
  const [logs2, setLogs2] = useState([]);
  const [stats2, setStats2] = useState({});
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

        
        setDiagram2(diagram.createCopyForSimulation());
        setSimulationRunning(false);
      };

      worker.onerror = (err) => {
        console.error('Worker selhal:', err);
        setSimulationRunning(false);
      };

    };

    const runSimulation2 = async () => {
      
      setSimulationRunning(true);

      const worker = new Worker(
        new URL('../../workers/simulationWorker.js', import.meta.url), // přizpůsob cestu!
        { type: 'module' }
      );


      // Odešli serializovaný diagram
      worker.postMessage({
        diagramData: diagram2.toSerializableObject()
      });

      // Získání výsledku
      worker.onmessage = (event) => {
        const { log, stats, error } = event.data;

        if (error) {
          console.error('Chyba ze simulace:', error);
          setSimulationRunning(false);
          return;
        }

        setLogs2(log);
        setStats2(stats);

        setSimulationRunning(false);
      };

      worker.onerror = (err) => {
        console.error('Worker selhal:', err);
        setSimulationRunning(false);
      };

    };

    const formatDate = (date) => {
      const options = {
        weekday: 'short',   
        day: 'numeric',       
        month: 'numeric',     
        year: 'numeric',      
        hour: 'numeric',      
        minute: '2-digit',    
        hour12: false        
      };
    
      return new Intl.DateTimeFormat('cs-CZ', options).format(date);
    };

    const translations = {
      Second: 'Sekunda',
      Seconds: 'Sekundy',
      Minute: 'Minuta',
      Minutes: 'Minuty',
      Hour: 'Hodina',
      Hours: 'Hodiny',
      Day: 'Den',
      Days: 'Dny',
      Week: 'Týden',
      Weeks: 'Týdny',
    };


  const handleSubmit = (event) => {
    event.preventDefault();
    
  };


    return <div className="slide">
      
          {simulationRunning && (
        <div className="simulation-overlay">
          <p className="loading-dots">Simulace probíhá</p>
        </div>
      )}

      <div className='slide-h1-wrapper'><h1>První simulace</h1></div>
      <div className='slide-content-wrapper'>

        <p>Nacházíme se v autodílně, která se zabývá repasováním automobilů. Sledujeme jejich proces opravy automobilu. Ten začíná v obchodním oddělení, které po předchozí dohodě se zákazníkem přijme automobil. Ten je v dílně prohlídnut a vyšetřen, z čehož vzniknou diagnostická data. Z těch je následně zpět v obchodním oddělení spočítána cena opravy. Po určení této ceny se přechází do skladu, kde skladník kontroluje stav zásob. Pokud nějaké nejsou dostupné, objedná je, počká na jejich příjezd a provede naskladnění, načež znovu kontroluje, zda má vše potřebné pro opravu. Pokud je vše dostupné, přechází se k opravě automobilu a po něm proces končí.</p>
       

      <div className='bpmn-diagram-wrapper'>
        <div
        ref={containerWorkshopRef}
        className='bpmn-diagram-supermarketver2'
        />
      </div>

      <h2>Spuštění první simulace</h2>
      <p>Scénář simulace má nastavené tyto parametry:</p>
     
      <div className="first-simulation-container">
      {diagram && (<form>
        <div><label htmlFor="instances">Počet instancí:</label>         
          <input
            type="text"
            id="instances"
            value={diagram.getNumberOfInstances()}
            disabled
          />
        </div>
        <div><label htmlFor="arrivaldistribution">Rozdělení příchodů:</label>                   
          <select value={diagram.getArrivalDistribution()} disabled id="arrivaldistribution">
            <option value="Fixed">Fixní</option>
            <option value="Exponential">Exponenciální</option>
            <option value="Normal">Normální</option>
          </select>
        </div>
        <div><label htmlFor="arrivalmean">Průměrná (střední) hodnota:</label>         
          <input
            type="text"
            id="arrivalmean"
            value={diagram.getArrivalMean()}
            disabled
          />
        </div>
        {diagram.getArrivalDistribution() == "Normal" && (<div><label htmlFor="arrivalstddeviation">Standardní odchylka:</label>         
          <input
            type="text"
            id="arrivalstddeviation"
            value={diagram.getArrivalStdDeviation()}
            disabled
          />
        </div>)}
        <div><label htmlFor="arrivalunit">Jednotka:</label>         
          <input
            type="text"
            id="arrivalunit"
            value={translations[diagram.getArrivalUnit()]}
            disabled
          />
        </div>
        <div><label htmlFor="starttime">Začátek simulace:</label>         
          <input
            type="text"
            id="starttime"
            value={formatDate(diagram.getStartTime())}
            disabled
          />
        </div>
        <div><label htmlFor="currency">Měna simulace:</label>         
          <input
            type="text"
            id="currency"
            value={diagram.getCurrency() == "CZK" ? "Kč" : diagram.getCurrency()}
            disabled
          />
        </div>
    </form>)}
    </div>
          
      <button onClick={runSimulation} disabled={simulationRunning}>
        {simulationRunning ? 'Simulace běží...' : 'Spusť simulaci'}
      </button>

      {stats.general && Object.keys(stats.general).length > 0 && (
          <GeneralData stats={stats} diagram={diagram}/>
)}


      {diagram2 && (<form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="instances2">Počet instancí:</label>         
          <input type="text" id="instances2" value={diagram2.getNumberOfInstances()} disabled />
        </div>
        <div><label htmlFor="arrivaldistribution2">Rozdělení příchodů:</label>                   
          <select value={diagram2.getArrivalDistribution()} id="arrivaldistribution2" 
                  onChange={(e) => {
                    diagram2.setArrivalDistribution(e.target.value);
                    forceUpdate();
                  }}>
            <option value="Fixed">Fixní</option>
            <option value="Exponential">Exponenciální</option>
            <option value="Normal">Normální</option>
          </select>
        </div>
        <div><label htmlFor="arrivalmean2">Průměrná (střední) hodnota:</label>         
          <input type="text" id="arrivalmean2" value={diagram.getArrivalMean()}
            onChange={(e) => {
              diagram2.setArrivalMean(e.target.value);
              forceUpdate();
            }}
          />
        </div>
        {diagram2.getArrivalDistribution() == "Normal" && (<div><label htmlFor="arrivalstddeviation2">Standardní odchylka:</label>         
          <input type="text" id="arrivalstddeviation2" value={diagram2.getArrivalStdDeviation()}
            onChange={(e) => {
              diagram2.setArrivalStdDeviation(e.target.value);
              forceUpdate();
            }}
          />
        </div>)}
        <div><label htmlFor="arrivalunit2">Jednotka:</label>      
          <select value={diagram2.getArrivalUnit()} id="arrivalunit2" 
                    onChange={(e) => {
                      diagram2.setArrivalUnit(e.target.value);
                      forceUpdate();
                    }}>
              <option value="Second">Sekunda</option>
              <option value="Minute">Minuta</option>
              <option value="Hour">Hodina</option>
              <option value="Day">Den</option>
              <option value="Week">Týden</option>
            </select>        
        </div>
        <div>
          <label htmlFor="starttime2">Začátek simulace:</label>         
          <input type="text" id="starttime2" value={formatDate(diagram.getStartTime())} disabled />
        </div>
        <div><label htmlFor="currency">Měna simulace:</label>         
          <input type="text" id="currency" value={diagram.getCurrency() == "CZK" ? "Kč" : diagram.getCurrency()} disabled />
        </div>
      <button onClick={runSimulation2} disabled={simulationRunning}  type="submit">
        {simulationRunning ? 'Simulace běží...' : 'Spusť simulaci'}
      </button>
    </form>)}

    {stats2.general && Object.keys(stats2.general).length > 0 && (
          <GeneralData stats={stats2} diagram={diagram2}/>
)}




    </div>

    
    </div>
    ;
}