import { useState, useEffect, useRef } from "react";
import BpmnViewer from 'bpmn-js';
import { BPMNAssembler } from '../../bpmn-parsing/BPMNAssembler';
import { GeneralData } from "../components/stats/GeneralData";
import { Heatmap } from "../components/stats/Heatmap";



const LOCAL_KEY_STATS = "chapter3-default-simulation-stats";
const LOCAL_KEY_DIAGRAM = "chapter3-default-simulation-diagram";

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
  

        localStorage.setItem(LOCAL_KEY_STATS, JSON.stringify(stats));
        localStorage.setItem(LOCAL_KEY_DIAGRAM, JSON.stringify(diagram.toSerializableObject()));

        setSlideFinished(prev => ({
          ...prev,
          [4]: true
        })); 
        
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
    


    return <div className="slide">
      
          {simulationRunning && (
        <div className="simulation-overlay">
          <p className="loading-dots">Simulace probíhá</p>
        </div>
      )}

      <div className='slide-h1-wrapper'><h1>První simulace</h1></div>
      <div className='slide-content-wrapper'>

        <p>Nacházíme se v autodílně, která se zabývá repasováním automobilů. Sledujeme jejich proces opravy automobilu. Ten začíná v obchodním oddělení, které po předchozí dohodě se zákazníkem přijme automobil. Ten je v dílně prohlídnut a vyšetřen, z čehož vzniknou diagnostická data. Z těch je následně zpět v obchodním oddělení spočítána cena opravy. Po určení této ceny se přechází do skladu, kde skladník kontroluje stav zásob. Pokud nějaké nejsou dostupné, objedná je, počká na jejich příjezd a provede naskladnění, načež znovu kontroluje, zda má vše potřebné pro opravu. Pokud je vše dostupné, přechází se k opravě automobilu a po něm proces končí. Tento proces je vyobrazen na modelu níže:</p>

      <div className='bpmn-diagram-wrapper'>
        <div ref={containerWorkshopRef} className='bpmn-diagram-supermarketver2' />
      </div>

      <h2>Spuštění první simulace</h2>
      <p className="explanation">V první simulaci sledujeme běžný provoz dílny. Ta má k dispozici dva mechaniky, jednoho prodejce a jednoho skladníka, kteří plní své činnosti. Skladové zásoby jsou vysoké, což znamená, že s 65% šancí jsou potřebné díly na skladě a jen v 35% případů je bude třeba objednat. Průměrně přichází jeden zákazník za dvanáct dní, ovšem normální rozdělení, které je zde použité, říká, že s největší pravděpodobností přijde mezi čtvrtým a dvacátým dnem. Simulace začíná v pondělí a cena je počítána v korunách. Parametry scénáře jsou přehledně vypsány zde:</p>
     
      <div className="first-simulation-container">
      {diagram && (<form>
        <div>
          <label htmlFor="instances">Počet instancí:</label>         
          <input type="text" id="instances" value={diagram.getNumberOfInstances()} disabled />
        </div>
        <div><label htmlFor="arrivaldistribution">Rozdělení příchodů:</label>                   
          <select value={diagram.getArrivalDistribution()} disabled id="arrivaldistribution">
            <option value="Fixed">Fixní</option>
            <option value="Exponential">Exponenciální</option>
            <option value="Normal">Normální</option>
          </select>
        </div>
        <div>
          <label htmlFor="arrivalunit">Jednotka:</label>         
          <input type="text" id="arrivalunit" value={translations[diagram.getArrivalUnit()]} disabled />
        </div>
        <div>
          <label htmlFor="arrivalmean">Průměrná (střední) hodnota:</label>         
          <input type="text" id="arrivalmean" value={diagram.getArrivalMean()} disabled />
        </div>
        {diagram.getArrivalDistribution() == "Normal" && (<div>
          <label htmlFor="arrivalstddeviation">Standardní odchylka:</label>         
          <input type="text" id="arrivalstddeviation" value={diagram.getArrivalStdDeviation()} disabled />
        </div>)}
        <div>
          <label htmlFor="starttime">Začátek simulace:</label>         
          <input type="text" id="starttime" value={formatDate(diagram.getStartTime())} disabled />
        </div>
        <div>
          <label htmlFor="currency">Měna simulace:</label>         
          <input type="text" id="currency" value={diagram.getCurrency() == "CZK" ? "Kč" : diagram.getCurrency()} disabled />
        </div>
        <div>
          <label htmlFor="warehouse">Skladové zásoby:</label>                   
          <select value={getWarehouse()} disabled id="warehouse">
            <option value="Low">Nízké</option>
            <option value="Middle">Střední</option>
            <option value="High">Vysoké</option>
          </select>
        </div>
    </form>)}
    </div>

    <p className="explanation">S těmito parametry je možné simulaci spustit kliknutím na tlačítko. Simulace potrvá delší časový úsek, během kterého aplikace bude oznamovat, že se tak děje.</p>
          
      <button onClick={runSimulation} disabled={simulationRunning} className="simulation-button">
        {simulationRunning ? 'Simulace běží...' : 'Spusť simulaci'}
      </button>

      {stats.general && Object.keys(stats.general).length > 0 && (<div className="first-general-data-container">
        <p className="explanation">Simulace skončila a poskytla první statistiky. V těch je možné vidět počet proběhlých instancí, celkovou cenu a celkovou dobu trvání. Dva grafy zároveň ukazují, jak byl čas v simulaci rozložen. První z nich dělí celkový čas na hodiny mimo pracovní dobu a ty v pracovní době, kam spadá jak čekání, tak samotná práce. Jejich poměr je pak lépe znázorněn na druhém grafu.<br /><br/>Posledním výstupem simulace jsou dvě heatmapy, které ukazují jak dlouho jednotlivé aktivity trvají vůči ostatním a jak dlouho čekají na své provedení. Jejich stupnice je následující: zelená, žlutá, oranžová a červená. Zelená barva znamení, že aktivita nečeká či netrvá příliš dlouho na provedení, červená je opakem. <br /><br/>Přestože simulaci spustíme znovu se stejnými parametry, může dát velmi odlišné výsledky. V tomto případě je to způsobeno hlavně počtem instancí procesů, jelikož dvacet je poměrně malé množství. Je možné si tyto změny vyzkoušet opětovním spuštěním první simulace po kliknutí na tlačítko Spusť simulaci.</p>
          <GeneralData stats={stats} diagram={diagram}/>
          <Heatmap stats={stats} diagram={diagram} file={'dilna-ver1.bpmn'}/>

          <p className="explanation">Na dalších stranách se bude se simulací dále pracovat - postupně bude možné měnit vybrané vstupní parametry a sledovat jejich vliv na výstupy simulace. Z důvodu rozsahu aplikace tak nebude možné měnit napříkad doby trvání aktivit nebo jim přiřazené zdroje.</p>
          </div>
)}

    </div>

    
    </div>
    ;
}