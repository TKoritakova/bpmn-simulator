import React, { useEffect, useRef, useState, useReducer } from 'react';
import BpmnViewer from 'bpmn-js';

/**
 * Finds maximum value of the number of going through an element
 * @param {*} stats stats
 * @returns maximum value of the number of going through an element
 */
function findMaxCount(stats) {
  let maxValue = -Infinity;
  let maxKey = null;

  for (const key in stats) {   
      const activity = stats[key];
      if (
        typeof activity.count === "number" &&
        activity.count > maxValue
      ) {
        maxValue = activity.count;
        maxKey = key;
      }   
  }
  return { key: maxKey, value: maxValue };
}

/**
 * Finds maximum value of element per instances.
 * @param {*} stats stats
 * @returns maximum value of element per instances
 */
function findMaxPercInstances(stats) {
  let maxValue = -Infinity;
  let maxKey = null;

  for (const key in stats) {
      const activity = stats[key];
      const perc = Math.round(activity.percInstances)
      if (perc > maxValue
      ) {
        maxValue = perc;
        maxKey = key;
      }   
  }

  return { key: maxKey, value: maxValue };
}

/**
 * Function to colorize heatmap.
 * @param {*} viewer viewer for heatmap
 * @param {*} stats stats
 * @param {*} type heatmap type
 * @returns 
 */
function colorizeDiagram(viewer, stats, type = 'iterations') {
  viewer.get('overlays').clear();
  let overlays = viewer.get('overlays');
  let elementRegistry = viewer.get('elementRegistry');
  
  let getValue = (info) => {
    if (type === 'iterations') {
      return info.count;
    } else if (type === 'percentage') {
      return info.percInstances.toFixed(0);
    } else {
      return 0;
    }
  };

  let result;
  if (type === 'iterations') {
    const max = findMaxCount(stats.activites).value;
    result = {red: max * 0.67,
        orange: max * 0.5,
        yellow: max * 0.33
    }
  } else if (type === 'percentage') {
    const max = findMaxPercInstances(stats.activites).value;
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

/**
 * React component displaying heatmap for percentage and number of passes elements.
 * @component
 * @param {*} param0 stats
 * @returns {JSX.Element} React element displaying percentage and number of passes elements
 */
export function HeatmapIterations({ stats, file  }) {
 
  // iterations
  const containerWorkshopRef1 = useRef(null);
  const viewerWorkshopRef1 = useRef(null);

  //percentage
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
        colorizeDiagram(viewerWorkshopRef1.current, stats, 'iterations');
      }).catch(err => {
          console.error('Chyba při načítání BPMN XML:', err);
      });


      if (!viewerWorkshopRef2.current) {
        viewerWorkshopRef2.current = new BpmnViewer({ container: containerWorkshopRef2.current });
      }
      viewerWorkshopRef2.current.importXML(text).then(async () => {
        viewerWorkshopRef2.current.get('canvas').zoom('fit-viewport');                   
        colorizeDiagram(viewerWorkshopRef2.current, stats, 'percentage');
      }).catch(err => {
          console.error('Chyba při načítání BPMN XML:', err);
      });

    })
    .catch(err => {
    console.error('Chyba při načítání BPMN souboru:', err);
    });
  }, [stats]);

  return (
    <div className='heatmap-section-container'>
      <div className='heatmap-container'>
        <h3>Heatmapa - počet spuštění aktivity</h3>
        <div ref={containerWorkshopRef1} className='heatmap' />
      </div>
      <div className='heatmap-container'>
        <h3>Heatmapa - % procesů</h3>
        <div ref={containerWorkshopRef2} className='heatmap'/>
      </div>
    </div>
  );

}