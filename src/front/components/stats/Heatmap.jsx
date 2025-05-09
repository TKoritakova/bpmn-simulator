import React, { useEffect, useRef, useState } from 'react';
import BpmnViewer from 'bpmn-js';

function findMaxAvgDurationWithoutOfftime(stats) {
    let maxValue = -Infinity;
    let maxKey = null;
  
    for (const key in stats) {
      
        const activity = stats[key];
        if (
          typeof activity.avgDurationWithoutOfftime === "number" &&
          activity.avgDurationWithoutOfftime > maxValue
        ) {
          maxValue = activity.avgDurationWithoutOfftime;
          maxKey = key;
        }
      
    }
  
    return { key: maxKey, value: maxValue };
  }

  function findMaxAvgWaitingForExecution(stats) {
    let maxValue = -Infinity;
    let maxKey = null;
  
    for (const key in stats) {
      
        const activity = stats[key];
        if (
          typeof activity.avgWaitingForExecution === "number" &&
          activity.avgWaitingForExecution > maxValue
        ) {
          maxValue = activity.avgWaitingForExecution;
          maxKey = key;
        }
      
    }
  
    return { key: maxKey, value: maxValue };
  }

function colorizeDiagram(viewer, stats, type = 'execution') {
  let overlays = viewer.get('overlays');
  let elementRegistry = viewer.get('elementRegistry');
  
  let getValue = (info) => {
    if (type === 'execution') {
      return info.avgDurationWithoutOfftime;
    } else if (type === 'waiting') {
      return info.avgWaitingForExecution;
    } else {
      return 0;
    }
  };

  let result;
  if (type === 'execution') {
    const max = findMaxAvgDurationWithoutOfftime(stats.activites).value;
    result = {red: max * 0.67,
        orange: max * 0.5,
        yellow: max * 0.33
    }
  } else if (type === 'waiting') {
    const max = findMaxAvgWaitingForExecution(stats.activites).value;
    result = {red: max * 0.67,
        orange: max * 0.5,
        yellow: max * 0.33
    }
  } else {
    return null;
  }


  for (const [id, info] of Object.entries(stats.activites || {})) {

    let shape = elementRegistry.get(id);
    if (shape) {
      const value = getValue(info);
      const overlayHtml = document.createElement('div');


      overlayHtml.className = 'highlight-overlay-green';

      if (value > result['red']) {
        overlayHtml.className = 'highlight-overlay-red';
      } else if (value > result['orange']) {
        overlayHtml.className = 'highlight-overlay-orange';
      } else if (value > result['yellow']) {
        overlayHtml.className = 'highlight-overlay-yellow';
      } else {
        overlayHtml.className = 'highlight-overlay-green';
      }

      overlayHtml.style.width = shape.width + 'px';
      overlayHtml.style.height = shape.height + 'px';

      overlays.add(id, {
        position: {
          top: 0,
          left: 0
        },
        html: overlayHtml
      });
    }

}
}


export function Heatmap({ stats, diagram, file  }) {


  // wait
  const containerWorkshopRef1 = useRef(null);
  const viewerWorkshopRef1 = useRef(null);

  // execution
  const containerWorkshopRef2 = useRef(null);
  const viewerWorkshopRef2 = useRef(null);


    useEffect(() => {
        fetch(file) 
        .then(res => res.text())
        .then(text => {
          
          if (!viewerWorkshopRef1.current) {
            viewerWorkshopRef1.current = new BpmnViewer({ container: containerWorkshopRef1.current });
          }
          viewerWorkshopRef1.current.importXML(text).then(async () => {
            viewerWorkshopRef1.current.get('canvas').zoom('fit-viewport');                   
            colorizeDiagram(viewerWorkshopRef1.current, stats, 'execution');
          }).catch(err => {
              console.error('Chyba při načítání BPMN XML:', err);
          });


          if (!viewerWorkshopRef2.current) {
            viewerWorkshopRef2.current = new BpmnViewer({ container: containerWorkshopRef2.current });
          }
          viewerWorkshopRef2.current.importXML(text).then(async () => {
            viewerWorkshopRef2.current.get('canvas').zoom('fit-viewport');                   
            colorizeDiagram(viewerWorkshopRef2.current, stats, 'waiting');
          }).catch(err => {
              console.error('Chyba při načítání BPMN XML:', err);
          });

          

        
        
          


        })
        .catch(err => {
        console.error('Chyba při načítání BPMN souboru:', err);
        });
    
    
      }, []);

 


  return (
    <div className='heatmap-section-container'>
      <div className='heatmap-container'>
        <h3>Heatmapa - čas provádění</h3>
        <div ref={containerWorkshopRef1} className='heatmap' />
      </div>
      <div className='heatmap-container'>
        <h3>Heatmapa - čekací doby</h3>
        <div ref={containerWorkshopRef2} className='heatmap'/>
      </div>
    </div>
  );

}