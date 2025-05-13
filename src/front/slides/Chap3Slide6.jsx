import { useState, useEffect, useRef, useReducer } from "react";
import BpmnViewer from 'bpmn-js';
import { BPMNAssembler } from '../../bpmn-parsing/BPMNAssembler';
import { GeneralData } from "../components/stats/GeneralData";
import { Heatmap } from "../components/stats/Heatmap";
import { BPMNDiagram } from "../../model/BPMNDiagram";
import { ActivitiesData } from "../components/stats/ActivitiesData";
import { HeatmapIterations } from "../components/stats/HeatmapIterations";


const LOCAL_KEY_STATS = "chapter3-default-simulation-stats";
const LOCAL_KEY_DIAGRAM = "chapter3-default-simulation-diagram";

export default function Chap3Slide6({ setSlideFinished, slideFinished }) {

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

      useEffect(() => {
      
  
      const storedDiagram = localStorage.getItem(LOCAL_KEY_DIAGRAM);
      if (storedDiagram) setDiagramFirstSimulation(BPMNDiagram.fromSerializableObject(JSON.parse(storedDiagram)));
      const storedStats = localStorage.getItem(LOCAL_KEY_STATS);
      if (storedStats) setStatsFirstSimulation(JSON.parse(storedStats));
  
  
    }, [slideFinished]);

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
          [6]: true
        }));

        forceUpdate()

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
    
    const saveWarehouse = (value) =>{
     
      const gateway = diagram.getObjectByID("Gateway_VseNaskladneno");
      if (gateway) {
        switch (value) {
          case "High":
            gateway.getProbabilities().find(p => p.id === "Flow_VseNaskladneno_OpravitAutomobil").probability = 0.65;
            gateway.getProbabilities().find(p => p.id === "Flow_VseNaskladneno_ObjednatMaterial").probability = 0.35;
            break;
          case "Low": 
            gateway.getProbabilities().find(p => p.id === "Flow_VseNaskladneno_OpravitAutomobil").probability = 0.35;
            gateway.getProbabilities().find(p => p.id === "Flow_VseNaskladneno_ObjednatMaterial").probability = 0.65;
            break;
          case "Middle":
            gateway.getProbabilities().find(p => p.id === "Flow_VseNaskladneno_OpravitAutomobil").probability = 0.5;
            gateway.getProbabilities().find(p => p.id === "Flow_VseNaskladneno_ObjednatMaterial").probability = 0.5;
            break;
        }
 
      }
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

      <div className='slide-h1-wrapper'><h1>Třetí simulace: Skladové zásoby</h1></div>
      <div className='slide-content-wrapper'>

      <div className='simulation-scenario-description-item'>
        <h2>Opakování</h2>              
          <p><b>Větvení</b> - všem větvením, které proces obsahuje, se musí přiřadit <b>pravděpodobnosti</b> k větvím, které z nich vychází. Jejich součet musí dát dohromady číslo jedna a určují, <b>s jakou pravděpodobností se určitá větev vykoná</b>. Pro případ, že se v procesu prochází daným větvením vícekrát a je třeba rozlišit s jakou pravděpodobností se větve vykonají, umožňují některé simulační nástroje navíc pro každou větev nastavit několik hodnot - pro první, druhý, třetí, ... průchod větvením.</p> 
      </div>
       
      <div className='bpmn-diagram-wrapper'>
        <div
        ref={containerWorkshopRef}
        className='bpmn-diagram-supermarketver2'
        />
      </div>

       
      {(!diagramFirstSimulation || !statsFirstSimulation) && (
        <p className="explanation">Nejsou dostupné výsledky z první simulace. Pro pokračování výuky se nejprve vraťte na příslušnou obrazovku s první simulací a spusťte ji.</p>
      )}

      {diagram && diagramFirstSimulation && statsFirstSimulation && (
        <p className="explanation">V této simulaci je možné měnit skladové zásoby. Ty mohou dosahovat tří hladin - nízké, střední a vysoké. Pro simulaci hladina skladových zásob znamená nastavení pravděpodobnosti na větvení, které je v procesu označeno otázkou, zda je vše naskladněno. Nízké skladové zásoby znamenají, že s 65% pravděpobností se bude muset objednávat materiál. Střední poté mají tuto pravděpodobnost 50% a vysoké 35%. Jakkoliv se může zdát, že je logické tedy držet si spíše vysoké skladové zásoby, protože mají nejmenší pravděpodobnost zdržení v důsledku objednávání nových zásob, výše skladových zásob se promítá i do nákladů na proces.<br /><br />
        Nízké skladové zásoby přidávají k celkové ceně procesu za každý měsíc, kdy proces běží (tj. 4 týdny pro zjednodušení), částku mezi 3 000 a 10 000 Kč. Střední poté částku mezi 10 000 Kč a 30 000 Kč a vysoké od 30 000 Kč výše. Z hlediska optimalizace nákladů není tedy vždy nejlepší možností držet si vysoké skladové zásoby.</p>
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
          <div><input type="text" id="starttime" value={formatDate(diagram.getStartTime())} disabled /></div>
        </div>
        <div><label htmlFor="currency">Měna simulace:</label>         
          <div><input type="text" id="currency" value={diagram.getCurrency() == "CZK" ? "Kč" : diagram.getCurrency()} disabled /></div>
        </div>
        <div><label htmlFor="warehouse">Skladové zásoby:</label>                   
          <div><select value={getWarehouse()} id="warehouse" 
              onChange={(e) => {
                saveWarehouse(e.target.value);
                forceUpdate();
              }}>
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
      <p className="explanation">Ke statistikám známým z předchozích simulací se i zde přidává jedna nová. Jedná se o dvě heatmapy, které znázorňují následující: první ukazuje četnost průchodů daným elementem, druhá pak procento instancí procesu, v nichž byla daná aktivita spuštěna. Příslušné heatmapy byly doplněny opět i k výsledkům první simulace, které jsou porovnání dostupné na konci této stránky.<br/><br/>Spusťte si simulaci několikrát a pozorujte, jak se simulace chová vůči jiné výši skladových zásob. Jak to ovlivňuje cenu? Počty spuštění instancí? Časy trvání a čekání? Pomáhá něčemu mít nižší nebo vyšší skladové zásoby?</p>
          <GeneralData stats={stats} diagram={diagram}/>
          <Heatmap stats={stats} diagram={diagram} file={'dilna-ver1.bpmn'}/>
          <HeatmapIterations stats={stats} file={'dilna-ver1.bpmn'} />
          <ActivitiesData stats={stats} />
          
          </div>
)}

{stats.general && Object.keys(stats.general).length > 0 && (<div>
      <h2>Výsledky první simulace</h2>
      <p className="explanation">Níže se nachází statistiky z první simulace, konkrétně jejího posledního spuštění. Jsou též rozšířené o příslušné heatmapy, aby bylo možné lépe provádět porovnání.</p>
          <GeneralData stats={statsFirstSimulation} diagram={diagramFirstSimulation}/>
          <Heatmap stats={statsFirstSimulation} diagram={diagramFirstSimulation} file={'dilna-ver1.bpmn'}/>
          <HeatmapIterations stats={statsFirstSimulation} file={'dilna-ver1.bpmn'} />
          <ActivitiesData stats={statsFirstSimulation} />
          </div>
)}



    </div>

    
    </div>
    ;
}