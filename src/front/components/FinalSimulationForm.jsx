import React, { useRef, useState, useEffect, useReducer } from 'react';
import { Timetable } from '../../model/Timetable';
import { Participant } from '../../model/Participant';


export function FinalSimulationForm({ diagram }) {

  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const handleSubmit = (event) => {
    event.preventDefault();
    
  };

  const formatDateTimeLocal = (date) => {
    const pad = (n) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
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
      <div key={index} className="simulation-form-resources final-simulation-form-resources">
        <p className='resource-description'>{info.getDescription()}</p>
        <div>
          <label htmlFor={info.getID() + "-workinghours"}>Pracovní doba:</label>
          <select id={info.getID() + "-workinghours"} value={info.getWorkingHours()} 
              onChange={(e) => {
              const value = e.target.value;
              info.setWorkingHours(value);
              forceUpdate();
              console.log(diagram)
            }}>
              {Object.entries(diagram.getAllTimetables() || {}).map(
                ([timetableID, info2], index2) => (
                  <option key={index2} value={info2.getName()}>{info2.getName()}</option>
                )
              )}
          </select>
        </div>
        <div>
          <label htmlFor={info.getID() + "-capacity"}>Kapacita:</label>         
          <div>
            <input type="number" id={info.getID() + "-capacity"} value={info.getNumber()} 
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value >= 1 && value <= 10) {
                  info.setNumber(value);
                  forceUpdate();
                }
              }}
            />
          </div>
        </div>


      </div>
    )

  ) : null;


  return (
    <div>
      <form onSubmit={handleSubmit} className="final-simulation-form">
        <div>
          <label htmlFor="instances">Počet instancí:</label>         
          <div><input type="text" id="instances" value={diagram.getNumberOfInstances()} disabled /></div>
        </div>
        
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

        <div className='final-form-heading'><h3>Pracovní doby</h3></div>

        {DisplayTimetables}
        
        <div><div className='final-form-button-timetable'><button onClick={addTimetable}  type="submit" className="simulation-button">
          Přidat pracovní dobu
        </button></div></div>

        <div className='final-form-heading'>
          <h3>Zdroje</h3>
        </div>
        {DisplayRecources}
      
      </form>
    </div>
  );

}