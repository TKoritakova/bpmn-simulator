import { useState, useEffect, useRef, useReducer } from "react";
import BpmnViewer from 'bpmn-js';
import { BPMNAssembler } from '../../bpmn-parsing/BPMNAssembler';
import { GeneralData } from "../components/stats/GeneralData";
import { Heatmap } from "../components/stats/Heatmap";
import { BPMNDiagram } from "../../model/BPMNDiagram";
import { ActivitiesData } from "../components/stats/ActivitiesData";
import { Timetable } from "../../model/Timetable";
import { Participant } from "../../model/Participant";
import { GeneralDataWithWeeklyCosts } from "../components/stats/GeneralDataWithWeeklyCosts";
import { ResourceUtilization } from "../components/stats/ResourceUtilization";

const LOCAL_KEY_STATS = "chapter3-default-simulation-stats";
const LOCAL_KEY_DIAGRAM = "chapter3-default-simulation-diagram";

export default function Chap3Slide8({ setSlideFinished }) {

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
          [9]: true
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

  const addTimetable = () => {
    let number = diagram ? diagram.getAllTimetables().length : 0;
    let timetable = new Timetable("Pracovní doba " + number, 1, 0, '00:00', '23:59');
    diagram.addTimetable(timetable);
    forceUpdate();
  }

  const DisplayTimetables = diagram ? Object.entries(diagram.getAllTimetables() || {}).map(
        ([timetableID, info], index) => (
          <div key={index} className="simulation-form-timetables">
            <div>
              <label htmlFor={"name" + timetableID}>Jméno:</label>         
              <div>
                <input type="text" id={"name" + timetableID} value={info.getName()} {...(info.getName() === "Default" ? { disabled: true } : { onChange: (e) => {
                  const value = e.target.value;
                  const valuematch = diagram.getAllTimetables().filter(timetable => timetable.getName() == value && timetable != info).length > 0;
 
                  if (value && !valuematch) {
                    info.setName(value)
                    forceUpdate();              
                  }
                } })} />
              </div>
            </div>
            <div>
              <label htmlFor={"dayFrom" + timetableID}>První pracovní den:</label>         
              <div>
                <select  id={"dayFrom" + timetableID} value={info.getBeginDay() == 0 ? 7 : info.getBeginDay()} {...(info.getName() === "Default" ? { disabled: true } : { onChange: (e) => {
                  const value = e.target.value;
                  const endDay = info.getEndDay() == 0 ? 7 : info.getEndDay();
                  if (value && (value <= endDay )) {
                    info.setBeginDay(value % 7)
                    forceUpdate();
                  }
                } })}>
                  <option value="1">Pondělí</option>
                  <option value="2">Úterý</option>
                  <option value="3">Středa</option>
                  <option value="4">Čtvrtek</option>
                  <option value="5">Pátek</option>
                  <option value="6">Sobota</option>
                  <option value="7">Neděle</option>
                  
                </select>
              </div>
            </div>
            <div>
              <label htmlFor={"dayTo" + timetableID}>Poslední pracovní den:</label>  
              <div>
                <select  id={"dayTo" + timetableID} value={info.getEndDay() == 0 ? 7 : info.getEndDay()} {...(info.getName() === "Default" ? { disabled: true } : { onChange: (e) => {
                  const value = e.target.value;
                  const beginDay = info.getBeginDay() == 0 ? 7 : info.getBeginDay();
                  
                  if (value && (value >= beginDay)) {
                    info.setEndDay(value % 7)
                    forceUpdate();
                  }
                } })}>
                  <option value="1">Pondělí</option>
                  <option value="2">Úterý</option>
                  <option value="3">Středa</option>
                  <option value="4">Čtvrtek</option>
                  <option value="5">Pátek</option>
                  <option value="6">Sobota</option>
                  <option value="7">Neděle</option>
                  
                </select>                    
              </div>
            </div>
            <div>
              <label htmlFor={"timeFrom" + timetableID}>Začátek pracovní doby:</label>         
              <div>
                <input type="time" id={"timeFrom" + timetableID} value={info.getBeginTime()} {...(info.getName() === "Default" ? { disabled: true } : { onChange: (e) => {
                  const value = e.target.value;
                  if (value && value < info.getEndTime()) {
                    info.setBeginTime(value)
                    forceUpdate();
                  }
                } })} />
              </div>
            </div>
            <div>
              <label htmlFor={"timeTo" + timetableID}>Konec pracovní doby:</label>         
              <div>
                <input type="time" id={"timeTo" + timetableID} value={info.getEndTime()} {...(info.getName() === "Default" ? { disabled: true } : { onChange: (e) => {
                  const value = e.target.value;
                  if (value && value > info.getBeginTime()) {
                    info.setEndTime(value)
                    forceUpdate();
                  }
                } })} />
              </div>
            </div>

          </div>
        )
      ) : null;

  const DisplayRecources = diagram ? Object.entries(diagram.getAllObjects().filter(object => object instanceof Participant && object.getDescription()) || {}).map(
        ([recourceID, info], index) => (
          <div key={index} className="simulation-form-resources">
            <label htmlFor={info.getID()}>{info.getDescription()}</label>
            <div><select id={info.getID()} value={info.getWorkingHours()} 
                onChange={(e) => {
                const value = e.target.value;
                info.setWorkingHours(value);
                forceUpdate();
                console.log(diagram)
              }}
                >
              {Object.entries(diagram.getAllTimetables() || {}).map(
                ([timetableID, info2], index2) => (
                  <option key={index2} value={info2.getName()}>{info2.getName()}</option>
                )
              ) 
              
              }
            </select></div>
          </div>
        )

      ) : null;

    return <div className="slide">
      
          {simulationRunning && (
        <div className="simulation-overlay">
          <p className="loading-dots">Simulace probíhá</p>
        </div>
      )}

      <div className='slide-h1-wrapper'><h1>Šestá simulace: Pracovní doby</h1></div>
      <div className='slide-content-wrapper'>

      <div className='simulation-scenario-description-item'>
              <h2>Opakování</h2>
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
        <p className="explanation">Poslední simulační cvičení je zaměřeno na pracovní doby. Jak je řečeno výše, určují čas, kdy bude zdroj pracovat. Zde je možné vytvořit si vlastní  pracovní dobu a upravit jí parametry. Jméno se nesmí shodovat se jménem jiné pracovní doby. Poslední pracovní den musí být tentýž nebo pozdější než první pracovní den. Stejně tak konec pracovní doby musí být později než její začátek - v opačném případě nepůjde údaje upravit. Vytvořené pracovní doby je následně možné přiřadit jednotlivým zdrojům.<br/><br/>
        Pro první spuštění s vlastní pracovní dobou je vhodné nastavit podobné parametry, jako má výchozí pracovní doba a změnit například pracovní dny nebo časy. Každému zdroji je možné nastavit jeho vlastní pracovní dobu.</p>
      )}

    
      {diagram && diagramFirstSimulation && statsFirstSimulation && (
        <form onSubmit={handleSubmit} className="simulation-form simulation-timetables">       
          {DisplayTimetables}
        
          <button onClick={addTimetable}  type="submit" className="simulation-button">
            Přidat pracovní dobu
          </button>

          <h3>Zdroje - pracovní doby</h3>

          {DisplayRecources}

          <button onClick={runSimulation} disabled={simulationRunning}  type="submit" className="simulation-button">
            {simulationRunning ? 'Simulace běží...' : 'Spusť simulaci'}
          </button>
    </form>)}

    {stats.general && Object.keys(stats.general).length > 0 && (<div>
      <h2>Výsledky simulace</h2>
      <p className="explanation">Výsledky simulace obsahují stejné statistiky jako předchozí stránka. Mění pracovní doby nějak časy čekání? Využití zdrojů? Celkovou dobu trvání? Porovnat lze opět s výsledky první simulace.</p>
          <GeneralDataWithWeeklyCosts stats={stats} diagram={diagram}/>
          <ResourceUtilization stats={stats} diagram={diagram}/>
          <Heatmap stats={stats} diagram={diagram} file={'dilna-ver1.bpmn'}/>
          <ActivitiesData stats={stats} />
          </div>
)}

{stats.general && Object.keys(stats.general).length > 0 && (<div>
      <h2>Výsledky první simulace</h2>
      <p className="explanation">Níže se nachází statistiky z první simulace, konkrétně jejího posledního spuštění. Je v nich použita výchozí pracovní doba pro všechny zdroje, což znamená od pondělí do pátku od 9:00 do 17:00.</p>
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