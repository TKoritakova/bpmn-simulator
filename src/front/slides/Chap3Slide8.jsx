import { useState, useEffect, useRef, useReducer } from "react";
import BpmnViewer from 'bpmn-js';
import { BPMNAssembler } from '../../bpmn-parsing/BPMNAssembler';
import { GeneralData } from "../components/stats/GeneralData";
import { Heatmap } from "../components/stats/Heatmap";
import { BPMNDiagram } from "../../model/BPMNDiagram";
import { ActivitiesData } from "../components/stats/ActivitiesData";
import { ResourceUtilization } from "../components/stats/ResourceUtilization";
import { GeneralDataWithWeeklyCosts } from "../components/stats/GeneralDataWithWeeklyCosts";

const LOCAL_KEY_STATS = "chapter3-default-simulation-stats";
const LOCAL_KEY_DIAGRAM = "chapter3-default-simulation-diagram";

export default function Chap3Slide8({ setSlideFinished, slideFinished }) {

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
          [8]: true
        }));

        setSimulationRunning(false);
      };

      worker.onerror = (err) => {
        console.error('Worker selhal:', err);
        setSimulationRunning(false);
      };

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

      <div className='slide-h1-wrapper'><h1>Pátá simulace: Kapacity zdrojů</h1></div>
      <div className='slide-content-wrapper'>

      <div className='simulation-scenario-description-item'>
        <h2>Opakování</h2>
        <p><b>Zdroje</b> jsou lidé či role, kteří na procesu pracují - tedy jsou to účastníci procesu. Taktéž to mohou být systémy, tedy jakékoliv aktivní zdroje definované při tvorbě procesu. Mohou být shodné s bazény a drahami v modelu. Každému zdroji se nastaví jeho <b>jméno</b>, <b>kapacita</b> (tedy například kolik prodavačů je k dispozici), <b>mzda</b> za časový údaj a <b>pracovní doba</b>.</p> 
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
        <p className="explanation">V tomto cvičení přecházíme od obecných parametrů simulačního scénáře k nastavení zdrojů. Měnit se bude jejich kapacita, tedy údaj, kolik lidí v každé dráze procesu je zároveň dostupných pro plnění aktivit. To může ovlivnit čekací doby, ale zároveň celkové náklady - je pravděpodobné, že se průměrné náklady výplat na týden zvednou.<br/><br/>Počet zdrojů, které je možné navolit, je omezen do intervalu 1 až 10. Hodnotu pole lze nejlépe měnit šipkami nahoru a dolů.</p>
      )}

    

      {diagram && diagramFirstSimulation && statsFirstSimulation && (<form onSubmit={handleSubmit} className="simulation-form">
        
        
        <div><label htmlFor="resource-sales">Obchodní oddělení</label>         
          <div>
            <input type="number" id="resource-sales" value={diagram.getObjectByID("Lane_ObchodniOddeleni").getNumber()} 
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value >= 1 && value <= 10) {
                  diagram.getObjectByID("Lane_ObchodniOddeleni").setNumber(value);
                  forceUpdate();
                }
              }}
            />
          </div>
        </div>
        <div><label htmlFor="resource-warehouse">Sklad</label>         
          <div>
            <input type="number" id="resource-warehouse" value={diagram.getObjectByID("Lane_Sklad").getNumber()} 
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value >= 1 && value <= 10) {
                  diagram.getObjectByID("Lane_Sklad").setNumber(value);
                  forceUpdate();
                }
              }}
            />
          </div>
        </div>
        <div><label htmlFor="resource-workshop">Dílna</label>         
          <div>
            <input type="number" id="resource-workshop" value={diagram.getObjectByID("Lane_Dilna").getNumber()} 
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value >= 1 && value <= 10) {
                  diagram.getObjectByID("Lane_Dilna").setNumber(value);
                  forceUpdate();
                }
              }}
            />
          </div>
        </div>
            
        
      <button onClick={runSimulation} disabled={simulationRunning}  type="submit" className="simulation-button">
        {simulationRunning ? 'Simulace běží...' : 'Spusť simulaci'}
      </button>
    </form>)}

    {stats.general && Object.keys(stats.general).length > 0 && (<div>
      <h2>Výsledky simulace</h2>
      <p className="explanation">Zobrazené statistiky pro tento příklad obsahují již známé statistiky pro aktivity a heatmapy. Celkové statistiky jsou mírně upraveny a obsahují dva nové řádky se mzdovými týdenními náklady. První z nich, který počítá jen s odpracovanými aktivitami, počítá mzdové náklady z celkové ceny (bez nákladů na sklad) a to jejím vydělením počtem týdnů. Celková cena procesu se určuje součtem cen za jednotlivé uskutečněné aktivity, které se počítají jako doba jejího trvání krát hodinová mzda zdroje, který na ní pracuje.<br/><br/>
      Druhý nový řádek říká, jaké jsou mzdové náklady za celou pracovní dobu použitých zdrojů - což je částka určená vynásobením jejich hodinové mzdy a počtu odpracovaných hodin za týden, který byl zde určen na 40. Skladník bere 200 Kč na hodinu, automechanik 250 Kč a obchodník 300 Kč. Tento údaj zároveň ukazuje, kolik společnost bude muset navíc zaplatit každý týden proti tomu, co bylo skutečně odpracováno. Že se částky nerovnají není špatně a není třeba se je snažit úplně vyrovnat, protože v reálném prostředí mohou zdroje zbytek své pracovní doby využít a využijí na úkoly z jiných procesů. Údaj je zde spíše pro zajímavost a uvědomění si, že mzdové náklady, které simulace spočítá, se nerovnají tomu, co jsou v realitě skutečně náklady na zaměstnanecké výplaty.<br/><br/>
      Dalším novým prvkem statistik jsou grafy využití zdrojů. Ty ukazují využití pracovní doby zdrojů, pokud by skutečně měly úkoly jen z tohoto procesu. Grafy lze též vyložit jako, kolik procent své pracovní doby zdroje tráví plněním úkolů z tohoto procesu.<br/><br/>
      Opět simulaci pusťte s různými počty kapacit zdrojů. Jak změny kapacit mění využití zdrojů? Týdenní mzdové náklady? Ale zároveň též doby čekání, jak celkové, tak u jednotlivých aktivit? Pro porovnání jsou i zde níže umístěny statistiky první simulace.</p>
          <GeneralDataWithWeeklyCosts stats={stats} diagram={diagram}/>
          <ResourceUtilization stats={stats} diagram={diagram}/>
          <Heatmap stats={stats} diagram={diagram} file={'dilna-ver1.bpmn'}/>
          <ActivitiesData stats={stats} />
          </div>
)}

{stats.general && Object.keys(stats.general).length > 0 && (<div>
      <h2>Výsledky první simulace</h2>
      <p className="explanation">Níže se nachází statistiky z první simulace, konkrétně jejího posledního spuštění, pro porovnání s daty ze scénáře s novými kapacitami. Původní kapacity jsou jeden dostupný obchodník, jeden skladník a dva automechnici.</p>
          <GeneralDataWithWeeklyCosts stats={statsFirstSimulation} diagram={diagramFirstSimulation}/>
          <ResourceUtilization stats={statsFirstSimulation} diagram={diagramFirstSimulation}/>
          <Heatmap stats={statsFirstSimulation} diagram={diagramFirstSimulation} file={'dilna-ver1.bpmn'}/>
          <ActivitiesData stats={statsFirstSimulation} />
          </div>
)}



    </div>

    
    </div>
    ;
}