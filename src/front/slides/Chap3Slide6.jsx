import { useState, useEffect, useRef, useReducer } from "react";
import BpmnViewer from 'bpmn-js';
import { BPMNAssembler } from '../../bpmn-parsing/BPMNAssembler';
import { GeneralData } from "../components/stats/GeneralData";
import { Heatmap } from "../components/stats/Heatmap";
import { BPMNDiagram } from "../../model/BPMNDiagram";
import { ActivitiesData } from "../components/stats/ActivitiesData";

const LOCAL_KEY_STATS = "chapter3-default-simulation-stats";
const LOCAL_KEY_DIAGRAM = "chapter3-default-simulation-diagram";

export default function Chap3Slide6({ setSlideFinished }) {

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
          [5]: true
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

      <div className='slide-h1-wrapper'><h1>Druhá simulace: Intervaly příchodů</h1></div>
      <div className='slide-content-wrapper'>

      <div className='simulation-scenario-description-item'>
              <h2>Opakování</h2>
              <p><b>Intervaly spouštění instancí</b> - údaj, který říká, v jakých intervalech spouští nové instance procesu. Například víme, že do prodejny supermarketu přichází průměrně patnáct zákazníků za hodinu, takže simulaci nastavíme, aby během hodiny simulačního času vytvořila patnáct nových instancí. Příchody se často nastavují podle pravděpodobnostního rozdělení doplněného o časovou jednotku. V této aplikaci se používají tři:</p>
                <ul>
                  <li><b>Fixní</b> - pevná hodnota nových instnací za časovou jednotku. Znamená to tedy, že instance vždy začne po pevně stanoveném čase. Například jednou za dva dny vždy přijde nové zboží do skladu.</li>
                  <li><b>Normální</b> - vytváření nových instancí se řídí normálním rozdělením, které má tvar gaussovy křivky. Ta nám říká, že zhruba 68% instancí začne v intervalu, který je ohraničen dvěma body, které vzniknou odečtením a přičtením standardních odchylky k průměrné hodnotě. Zbytek instancí se vytvoří dříve nebo později, ale čím dále je hodnota od průměrné, tím menší pravděpodobnost je, že se v ní nová instance vytvoří. Do scénáře se poté tedy zadává časová jednotka, průměrná hodnota toho, jak jsou od sebe dva příchody vzdáleny, a možná odchylka. Příkladem tohoto rozdělení může být, že víme, že zákazník chodí tedy jednou za šest minut. Pokud je odchylka dvě minuty, znamená to, že 68% zákazníků, kteří po sobě přichází, přijdou po čtyřech až osmi minutách po předchozím.</li>
                  <li><b>Exponenciální</b> - vytváření nových instancí se řídí exponenciálním rozdělením. Toto rozdělení má křivku, která je nejstrmější na začátku a proto se většina je větší pravděpodobnost, že nová instance bude vytvořena tam, spíše než později - čím déle se čeká, tím menší pravděpodobnost výskytu je. Do scenáře se zadává časová jednotka průměrná hodnota frevence příchodů - například dvě instance za minutu. To znamená, že většina nových instancí se vyskytne do 30 sekund od té předchozí. Může se však stát, že to bude až po minutě a půl, ovšem je to málo pravděpodobné. Naopak případ do deseti sekund je velmi pravděpodobný.</li>
                </ul>
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
        <p className="explanation">V tomto cvičení je možné měnit parametry intervalů příchodů simulací. Možné je vybírat ze tří typů pravděpodobnostích rozdělení, které jsou popsány výše. Kromě typu rozdělení je možné určit i časovou jednotku, která pro rozdělení platí, a jeho parametry. Pro ty platí velikostní omezení - zadat lze jen čísla od 1 do 50. Čísla, která zadáte, je dobré promyslet - nesmyslné či příliš velké parametry mohou znamenat, že simulace poběží velmi dlouho. Po navolení parametrů spusťte simulaci.</p>
      )}

    

      {diagram && diagramFirstSimulation && statsFirstSimulation && (<form onSubmit={handleSubmit} className="simulation-form">
        <div>
          <label htmlFor="instances">Počet instancí:</label>         
          <div><input type="text" id="instances" value={diagram.getNumberOfInstances()} disabled /></div>
        </div>
        <div><label htmlFor="arrivaldistribution">Rozdělení příchodů:</label>                   
        <div><select value={diagram.getArrivalDistribution()} id="arrivaldistribution" 
                  onChange={(e) => {
                    diagram.setArrivalDistribution(e.target.value);
                    forceUpdate();
                  }}>
            <option value="Fixed">Fixní</option>
            <option value="Exponential">Exponenciální</option>
            <option value="Normal">Normální</option>
          </select></div>
        </div>
        <div><label htmlFor="arrivalunit">Jednotka:</label>      
        <div><select value={diagram.getArrivalUnit()} id="arrivalunit" 
                    onChange={(e) => {
                      diagram.setArrivalUnit(e.target.value);
                      forceUpdate();
                    }}>
              <option value="Second">Sekunda</option>
              <option value="Minute">Minuta</option>
              <option value="Hour">Hodina</option>
              <option value="Day">Den</option>
              <option value="Week">Týden</option>
            </select></div>       
        </div>
        <div><label htmlFor="arrivalmean">Průměrná (střední) hodnota:</label>         
        <div><input type="number" id="arrivalmean" value={diagram.getArrivalMean()} 
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value >= 1 && value <= 50) {
                diagram.setArrivalMean(value);
                forceUpdate();
              }
            }}
          /></div>
        </div>
        {diagram.getArrivalDistribution() == "Normal" && (<div><label htmlFor="arrivalstddeviation">Standardní odchylka:</label>         
          <div><input type="number" id="arrivalstddeviation" value={diagram.getArrivalStdDeviation()}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value >= 1 && value <= 50) {
                diagram.setArrivalStdDeviation(value);
                forceUpdate();
              }
            }}
          /></div>
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
      <p className="explanation">Statistiky druhé simulace obsahují stejné tabulky, grafy a heatmapy, které byly představeny na předchozím slidu. Navíc je zde tabulka statistik podle aktivit, v níž je možné pro každou událost a aktivitu sledovat, jak dlouho se celkově prováděla, jaká byla skutečná doba zpracování v pracovních hodinách a jak dlouho se čekalo na provedení. Pro každou tuto charakteristiku jsou k dispozici tři údaje - minimální, průměrná a maximální hodnota. Tabulka též ukazuje, kolikrát byl daný element spuštěn a v kolika procentech instancí procesů to bylo.<br/><br/>Na základě změny vstupních parametrů simulačního scénáře zkuste určit, jaký vliv tato změna měla na průběh simulace. Zvýšili se čekací doby? Zkrátily? Kterým aktivitám to pomohlo? A kterým naopak ne? Došlo někde k výraznému prodražení? Pro porovnání se níže nachází výsledky první simulace. I tuto simulaci je možné spustit vícekrát s různými vstupy a pozorovat chování.</p>
          <GeneralData stats={stats} diagram={diagram}/>
          <Heatmap stats={stats} diagram={diagram} file={'dilna-ver1.bpmn'}/>
          <ActivitiesData stats={stats} />
          </div>
)}

{stats.general && Object.keys(stats.general).length > 0 && (<div>
      <h2>Výsledky první simulace simulace</h2>
      <p className="explanation">Níže se nachází statistiky z první simulace, konkrétně jejího posledního spuštění. Jsou též rozšířené o statistiku po jednotlivých aktivitách, aby bylo možné lépe provádět porovnání.</p>
          <GeneralData stats={statsFirstSimulation} diagram={diagramFirstSimulation}/>
          <Heatmap stats={statsFirstSimulation} diagram={diagramFirstSimulation} file={'dilna-ver1.bpmn'}/>
          <ActivitiesData stats={statsFirstSimulation} />
          </div>
)}



    </div>

    
    </div>
    ;
}