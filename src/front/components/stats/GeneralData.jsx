import React, { useEffect, useRef, useState, PureComponent } from 'react';
import { Statistics } from '../../../simulation/Statistics';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Legend  } from 'recharts';


export function GeneralData({ stats, diagram }) {
  
  const data = [
    { name: 'Čekání', value: stats.general.totalWaitingForExecution },
    { name: 'Práce v pracovní době', value: stats.general.totalDurationWithoutOfftime },
    { name: 'Čekání mimo pracovní dobu', value: stats.general.totalDuration - stats.general.totalDurationWithoutOfftime },
  ];

  const data2 = [
    { name: 'Čekání', value: stats.general.totalWaitingForExecution },
    { name: 'Práce v pracovní době', value: stats.general.totalDurationWithoutOfftime },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];
  
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
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

 

  return (
    <div>
      

      {stats.general && Object.keys(stats.general).length > 0 && (
        <div>
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
        <tr>
          <td>Počet instancí:</td>
          <td>{stats.general.numberOfInstances}</td>
        </tr>
        <tr>
          <td>Celková cena:</td>
          <td>{Statistics.convertGeneralValues("totalPrice",stats.general.totalPrice,diagram)}</td>
        </tr>
        <tr>
          <td>Začátek - konec:</td>
          <td><div>{formatDate(diagram.getStartTime())} - {formatDate(new Date(diagram.getStartTime().getTime() + stats.general.totalRealExecutionTime * 1000))} ({Statistics.convertGeneralValues("totalRealExecutionTime",stats.general.totalRealExecutionTime,diagram)})</div></td>
        </tr>
        <tr>
          <td>Celkový součet času instancí:</td>
          <td>{Statistics.convertGeneralValues("totalWholeDuration",stats.general.totalWholeDuration,diagram)}</td>
        </tr>
      </tbody>
    </table>
  </div>
  
  
        <PieChart width={400} height={400}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend /> 
        </PieChart>
    
        <PieChart width={400} height={400}>
          <Pie
            data={data2}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data2.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend /> 
        </PieChart>
    
  
  </div>
)}  

  

    </div>
  );

}