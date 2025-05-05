import { useState, useEffect, useRef } from "react";
import BpmnViewer from 'bpmn-js';
import { BPMNAssembler } from '../../bpmn-parsing/BPMNAssembler';
import { Statistics } from '../../simulation/Statistics';
import { SimulationEngine } from '../../simulation/SimulationEngine';
import { GeneralData } from "../components/stats/GeneralData";

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
      {diagram && (<form onSubmit={handleSubmit}>
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
      <button type="submit">Odeslat</button>
    </form>)}
    </div>
          
      <button onClick={runSimulation} disabled={simulationRunning}>
        {simulationRunning ? 'Simulace běží...' : 'Simuluj'}
      </button>

      {stats.general && Object.keys(stats.general).length > 0 && (
          <GeneralData stats={stats} diagram={diagram}/>
)}

      </div>   
    </div>
    ;
}