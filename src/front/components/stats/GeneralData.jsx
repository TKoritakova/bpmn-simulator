import React, { useEffect, useRef, useState } from 'react';
import { Statistics } from '../../../simulation/Statistics';

export function GeneralData({ stats, diagram }) {
  
    

  const DisplayGeneralData = Object.entries(stats.general || {}).map(
    ([key, value], index) => (
      <tr key={index}>
        <td>{Statistics.convertGeneralDescriptions(key)}</td>
        <td>{Statistics.convertGeneralValues(key,value,diagram)}</td>
      </tr>
    )
  );

 

  return (
    <div>
      

      {stats.general && Object.keys(stats.general).length > 0 && (
  <div style={{ marginTop: '2rem' }}>
    <h3>General info</h3>
    <table className="table table-striped">
      <thead>
        <tr>
          <th>Info</th>
          <th>Údaj</th>
        </tr>
      </thead>
      <tbody>
        {DisplayGeneralData}
      </tbody>
    </table>
  </div>
)}  

  

    </div>
  );

}