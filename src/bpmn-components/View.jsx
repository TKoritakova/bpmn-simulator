
import React, { useEffect, useRef } from 'react';
import BpmnViewer from 'bpmn-js';

export function View({ xml }) {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);

  useEffect(() => {

    if (!viewerRef.current) {
      viewerRef.current = new BpmnViewer({
        container: containerRef.current,
      });
    }

    if (xml) {
      viewerRef.current.importXML(xml).then(() => {
        console.log('Diagram načten');
        viewerRef.current.get('canvas').zoom('fit-viewport');

     
        const definitions = viewerRef.current.getDefinitions();
        console.log('BPMN DEFINITIONS:', definitions);

        window.bpmnDefinitions = definitions;
      }).catch(err => {
        console.error('Chyba při načítání BPMN XML:', err);
      });
    }
  }, [xml]);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '600px', border: '1px solid #ccc' }}
    />
  );
}
