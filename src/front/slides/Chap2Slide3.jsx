import { useState, useEffect, useRef } from 'react';
import BpmnViewer from 'bpmn-js';

export default function Chap2Slide3({ setSlideFinished }) {

    const containerRef = useRef(null);
    const viewerRef = useRef(null);


    useEffect(() => {
        fetch('bpmn-basics.bpmn') 
            .then(res => res.text())
            .then(text => {
                
                if (!viewerRef.current) {
                        viewerRef.current = new BpmnViewer({ container: containerRef.current });
                }
                viewerRef.current.importXML(text).then(async () => {
                    viewerRef.current.get('canvas').zoom('fit-viewport');                
                           
                }).catch(err => {
                    console.error('Chyba při načítání BPMN XML:', err);
                });
            })
            .catch(err => {
            console.error('Chyba při načítání BPMN souboru:', err);
            });
    
        setSlideFinished(prev => ({
                ...prev,
                [3]: true
              }));
              
          }, []);


    

    return <div className="slide">
        <div className='slide-h1-wrapper'><h1>Základní prvky BPMN</h1></div>
        <div className='slide-content-wrapper'>

           

            <div className='bpmn-diagram-wrapper'><div
                ref={containerRef}
                className='bpmn-diagram-basics'
            /></div>





    </div>   </div>
    ;
}