import { useState, useEffect, useRef } from 'react';
import BpmnViewer from 'bpmn-js';

export default function Chap2Slide2({ setSlideFinished }) {

    const containerRef = useRef(null);
    const viewerRef = useRef(null);


    useEffect(() => {
        fetch('easyprocess.bpmn') 
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
                [2]: true
              }));
              
          }, []);


    

    return <div className="slide">
        <div className='slide-h1-wrapper'><h1>Notace pro modelování a BPMN</h1></div>
        <div className='slide-content-wrapper'>

            <p>Model na předchozí stránce sice poskytuje visualizaci procesu, ovšem je příliš jednoduchý a jeho tvorba nemá žádná pravidla pro to, jak co znázronit. Z těch důvodů používáme pro modelování procesů modelovací notace. Těch je celá řada a mezi nejznámější patří UML (Unified Modeling Language), EPC (Event Driven Process Chain), BPEL (Business Process Execution Language) a BPMN (Business Process Model and Notation).</p>

      
            <h2>BPMN (Business Process Model and Notation)</h2>

            <p>BPMN je notace, která standardizuje modelování procesů a je čitelná pro technické i netechnické uživatele, jelikož je intuitivnější než ostatní zmíněné notace.</p>

            <p>Umožňuje vizuálně znázornit, jak jednotlivé činnosti v organizaci probíhají, kdo je vykonává a jak jsou mezi sebou propojeny. Použítse dá například pro návrh a optimalizaci interních procesů organizce, automatizaci podnikových informačních systémů a analýzu efektivity procesů.</p>

            <p>Na obrázku níže je model z předchozí stránky přepsaný do bpmn notace. Pro zachování jednoduchosti zatím nejsou dodržena všechna pravidla notace, takže model není zcela správně a je určen pouze pro prvotní porovnání obou zápisů.</p>

            <div className='bpmn-diagram-wrapper'><div
                ref={containerRef}
                className='bpmn-diagram-easyprocess'
            /></div>





    </div>   </div>
    ;
}