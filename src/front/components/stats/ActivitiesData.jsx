import React, { useRef, useState, useEffect } from 'react';
import { Statistics } from '../../../simulation/Statistics';


export function ActivitiesData({ stats }) {
  

    const DisplayData = Object.entries(stats.activites || {}).map(
      ([activityID, info], index) => (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{info.name}</td>
          <td>{info.count}</td>
          <td>{info.percInstances.toFixed(2)}</td>
  
          <td>{Statistics.prepareValueForReading(info.minWholeDuration)}</td>
          <td>{Statistics.prepareValueForReading(info.avgWholeDuration)}</td>
          <td>{Statistics.prepareValueForReading(info.maxWholeDuration)}</td>

          <td>{Statistics.prepareValueForReading(info.minDurationWithoutOfftime)}</td>
          <td>{Statistics.prepareValueForReading(info.avgDurationWithoutOfftime)}</td>
          <td>{Statistics.prepareValueForReading(info.maxDurationWithoutOfftime)}</td>
  
          <td>{Statistics.prepareValueForReading(info.minWaitingForExecution)}</td>
          <td>{Statistics.prepareValueForReading(info.avgWaitingForExecution)}</td>
          <td>{Statistics.prepareValueForReading(info.maxWaitingForExecution)}</td>
          
  
         
        </tr>
      )
    );
 

  return (
    <div>

{stats.activites && Object.keys(stats.activites).length > 0 && (
  <div className='activities-stats'>
    <h3>Statistika po jednotlivých aktivitách</h3>
    <table className="table table-striped table-activities">
      <thead>
        <tr>
          <th rowSpan="2">#</th>
          <th rowSpan="2">Aktivita</th>
          <th rowSpan="2">Počet průchodů</th>
          <th rowSpan="2">% inst.</th>
          <th colSpan="3">Celkový čas</th>
          <th colSpan="3">Čas provádění v prac. době</th>
          <th colSpan="3">Čas čekání</th>
      
        </tr>
        <tr>
          <th>Min</th><th>Avg</th><th>Max</th>
          <th>Min</th><th>Avg</th><th>Max</th>
          <th>Min</th><th>Avg</th><th>Max</th>       
        </tr>
      </thead>
      <tbody>
        {DisplayData}
      </tbody>
    </table>
  </div>
)}
      

   

  

    </div>
  );

}