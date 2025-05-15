import { useState, useEffect, useRef, useReducer } from "react";
import { useNavigate } from 'react-router-dom';
import BpmnViewer from 'bpmn-js';
import { BPMNAssembler } from '../../bpmn-parsing/BPMNAssembler';
import { Heatmap } from "../components/stats/Heatmap";
import { ActivitiesData } from "../components/stats/ActivitiesData";
import { FinalSimulationForm } from "../components/FinalSimulationForm";
import { GeneralDataWithWeeklyCosts } from "../components/stats/GeneralDataWithWeeklyCosts";
import { HeatmapIterations } from "../components/stats/HeatmapIterations";
import { ResourceUtilization } from "../components/stats/ResourceUtilization";
import random from 'random';
import confetti from 'canvas-confetti';


const LOCAL_KEY_CHAP4_SUBMITTED = "chapter4-submitted";

export default function Chap4Slide1({ setSlideFinished }) {

  const containerWorkshopRef = useRef(null);
  const viewerWorkshopRef = useRef(null);
  const containerWorkshopRefLight = useRef(null);
  const viewerWorkshopRefLight = useRef(null);
  const [diagram, setDiagram] = useState(null);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [goalReached, setGoalReached] = useState(false);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({});
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const navigate = useNavigate();


  useEffect(() => {
    fetch('dilna-ver2.bpmn') 
    .then(res => res.text())
    .then(text => {
      
      if (!viewerWorkshopRef.current) {
        viewerWorkshopRef.current = new BpmnViewer({ container: containerWorkshopRef.current });
      }
      viewerWorkshopRef.current.importXML(text).then(async () => {
        viewerWorkshopRef.current.get('canvas').zoom('fit-viewport'); 

                  
      }).catch(err => {
          console.error('Chyba při načítání BPMN XML:', err);
      });
    })
    .catch(err => {
    console.error('Chyba při načítání BPMN souboru:', err);
    });
    
    fetch('dilna-ver2-light.bpmn') 
    .then(res => res.text())
    .then(text => {
      
      if (!viewerWorkshopRefLight.current) {
        viewerWorkshopRefLight.current = new BpmnViewer({ container: containerWorkshopRefLight.current });
      }
      viewerWorkshopRefLight.current.importXML(text).then(async () => {
        viewerWorkshopRefLight.current.get('canvas').zoom('fit-viewport'); 
        const definitions = viewerWorkshopRefLight.current.getDefinitions();    
        const assembledDiagram = await BPMNAssembler.buildFromDefinitions(definitions, 'dilna-ver2-scenario1.xml');
        setDiagram(assembledDiagram);            
                  
      }).catch(err => {
          console.error('Chyba při načítání BPMN XML:', err);
      });
    })
    .catch(err => {
    console.error('Chyba při načítání BPMN souboru:', err);
    });

  }, []);

  const ref = useRef();
  const [hasExploded, setHasExploded] = useState(false);


  useEffect(() => {
    if (goalReached && !hasExploded) {
      confetti({particleCount: 200,      
                    spread: 70,
                    angle: 315,              
                    origin: { x: 0.2, y: 0 }}); 
          confetti({particleCount: 200,      
                    spread: 70,
                    angle: 225,              
                    origin: { x: 0.8, y: 0 }});
         confetti({particleCount: 200,      
                    spread: 70,
                    angle: 45,              
                    origin: { x: 0.2, y: 0.8 }});
          confetti({particleCount: 200,      
                    spread: 70,
                    angle: 135,              
                    origin: { x: 0.8, y: 0.8 }});
      
      setHasExploded(true);
    }
  }, [goalReached, hasExploded]);

  const generateArrivalDistribution = () => {
        
        let generator = random.uniform(0,1);
        let randomNumber = generator();
      
        if (randomNumber > 0.85) {
          diagram.setArrivalDistribution("Exponential");
        } else {
          diagram.setArrivalDistribution("Normal");        
        }
        forceUpdate();
      
  }

  const checkGoals = (stats) => {
    let maxWaiting = -Infinity;
    for (const key in stats.activites) {
      const activity = stats.activites[key];   
      const perc = activity.maxWaitingForExecution
        if (perc > maxWaiting) {
          maxWaiting = perc;
        }
    }

      
    let weeks = stats.general.totalRealExecutionTime / (60 * 60 * 24 * 7);
    let costs = 0;
    for (let key in stats.resources) {
      let participant = stats.resources[key]; 
      costs += (participant.allShiftsLenght / 3600) * diagram.getObjectByID(participant.id).getCost();
    }

    let priceGoal = (stats.general.totalPrice+stats.general.totalWarehouse) <= 2000000;
    let waitingGoal = maxWaiting <= (4 * 7 * 24 * 60 * 60);
    let utilizationGoal = (stats.resources["Lane_Dilna"].workedTime / stats.resources["Lane_Dilna"].allShiftsLenght) >= 0.7;
    let payCostsGoal = (stats.general.totalPrice / (weeks)) <= 70000;
    let payCostsGoalReal = (costs/weeks) <= 100000;
    let lenghtGoal = stats.general.totalRealExecutionTime <= (30 * 7 * 24 * 60 * 60 );
 

    return priceGoal && waitingGoal && utilizationGoal && payCostsGoal && lenghtGoal && payCostsGoalReal;
  }

  const runSimulation = async () => {
    generateArrivalDistribution();
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
   
      if(checkGoals(stats)) {
        setGoalReached(true);
        setSlideFinished(prev => ({
          ...prev,
          [1]: true
        }));
        localStorage.setItem(LOCAL_KEY_CHAP4_SUBMITTED, true);
      }
    };

    worker.onerror = (err) => {
      console.error('Worker selhal:', err);
      setSimulationRunning(false);
    };

  };

  const resetApp = () => {
    localStorage.clear();
    navigate('/bpmn-simulator/');
  }

  const hideGoalReached = () => {
    setGoalReached(false);
    setHasExploded(false);
  }

  return <div className="slide">
    
    {simulationRunning && (
      <div className="simulation-overlay">
        <p className="loading-dots">Simulace probíhá</p>
      </div>
    )}

    {(goalReached) && (
      <div className="finished-overlay" ref={ref}>
        <p>Výborně!</p>
        <p className="finished-overlay-p">Bylo dosaženo požadovaných cílů a tím dokončen výukový program. Můžete pokračovat v testování simulací nebo aplikaci resetovat a začít od začátku.</p>
        <button onClick={hideGoalReached} className="simulation-button">
          Simulovat dál
        </button>
        <button onClick={resetApp} className="simulation-button">
          Resetovat aplikaci
        </button>
      </div>
    )}

    <div className='slide-h1-wrapper'><h1>Závěrečný úkol</h1></div>
    <div className='slide-content-wrapper'>

      <p className="explanation">Stále se nacházíme v autodílně, která se zabývá repasováním automobilů. Proces, který tentokrát sledujeme, je rozšířený o nové aktivity a komunikaci se zákazníkem, který však do simulace následně vstupuje jako black box a elementy v jeho bazénu simulaci neovlivňují.<br/><br/>
      Proces opět začíná v obchodním oddělení, které přijme objednávku i automobil. Ten je v dílně prohlídnut a vyšetřen, z čehož vzniknou diagnostická data. Z těch je následně zpět v obchodním oddělení spočítána cena opravy. Jakmile je cena určena, je odeslána zákazníkovi. Ten musí obchodnímu oddělení odpovědět, jestli s cenou souhlasí. Pokud ne, automobil se mu vrátí a proces končí. Pokud zákazník s cenou souhlasí, přechází se do skladu, kde skladník kontroluje stav zásob. Pokud nějaké nejsou dostupné, objedná je, počká na jejich příjezd a provede naskladnění, načež znovu kontroluje, zda má vše potřebné pro opravu. Pokud je vše dostupné, přechází se k opravě automobilu. Po jejím skončení mechanik ještě auto připraví na předání a obchodní zástupce společnosti jej předá zákazníkovi. Tím proces z pohledu dílny končí. Celý tento proces je vyobrazen na modelu níže:
      </p>
      
      <div className='bpmn-diagram-wrapper'>
        <div
        ref={containerWorkshopRef}
        className='bpmn-diagram-supermarketver2'
        />
      </div>

      <div className="explanation">
        <p>Pro úspěšné zakončení cesty touto aplikací je nutné nastavit parametry vstupního scénáře tak, aby:</p>
        <ul>
          <li>Celkové náklady na simulaci nepřesáhly 2 000 000 Kč.</li>
          <li>Týdenní mzdové náklady (za odpracované aktivity) nepřesáhly 70 000 Kč.</li>
          <li>Týdenní mzdové náklady (skutečné) nepřesáhly 100 000 Kč.</li>
          <li>Doba trvání (začátek - konec) nepřesáhla 30 týdnů.</li>
          <li>Využití automechanika bylo alespoň 70%.</li>
          <li>Maximální hodnota čekání, která se u aktivit vyskytne, nepřesáhla 4 týdny.</li>
        </ul>

        <p>Rozdělení příchodů instancí bude s 95% pravděpodobností normální se střední hodnotou 48 hodin a odchylkou 20. Ve zbylých 5% to bude exponenciální. Šance, že zákazník přijme cenovou nabídku, je 85%. Pravděpodobnosti skladových zásob zůstávají stejné jako v předchozích příkladech - vysoké zásoby znamenají, že s 65% je materiál skladem, střední 50% a nízké 35%.</p>

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
        <div className="final-simulation-stats">
          <h2>Výsledky simulace</h2>
          <p className="explanation">Níže jsou umístěné všechny statistiky, které byly použity v jednotlivých příkladech dříve. Hledejte příslušné výsledky, které je potřeba dostat pod či nad nějakou hodnotu a postupně zkuste odladit vstupní parametry tak, aby jich bylo skutečně dosaženo.</p>
          <GeneralDataWithWeeklyCosts stats={stats} diagram={diagram}/>
          <ResourceUtilization stats={stats} diagram={diagram}/>
          <Heatmap stats={stats} diagram={diagram} file={'dilna-ver2.bpmn'}/>
          <HeatmapIterations stats={stats} file={'dilna-ver2.bpmn'} />
          <ActivitiesData stats={stats} />
        </div>
      )}
    </div>

    
  </div>;
}