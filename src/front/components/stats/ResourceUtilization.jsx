import React, { useEffect, useRef, useState, PureComponent } from 'react';
import { Statistics } from '../../../simulation/Statistics';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Legend  } from 'recharts';


export function ResourceUtilization({ stats, diagram }) {
  
  
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

  const getData = (info) => {
    return [
      {name: 'Plnění pracovních úkolů', value: info.workedTime},
      {name: 'Čekání na pracovní úkol', value: (info.allShiftsLenght - info.workedTime)},
    ]
  };

  const DisplayData = Object.entries(stats.resources || {}).map(
        ([resourceID, info], index) => (
          <div key={index}>
            <h3>{info.name}</h3>
            <PieChart width={300} height={300}>
              <Pie
                data={getData(info)}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {getData(info).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend /> 
            </PieChart>
            
    
           
          </div>
        )
      );

  return (
    <div>
      

      {stats.general && Object.keys(stats.general).length > 0 && (
        <div className="general-data">

          <h3>Využití zdrojů</h3>
          <div className='utilization-graphs'>       
            {DisplayData}     
          </div>
        </div>
      )}  

  

    </div>
  );

}