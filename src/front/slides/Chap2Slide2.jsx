import { useState, useEffect, useRef } from 'react';
import BpmnViewer from 'bpmn-js';

/**
 * React component displaying second lesson's second slide. 
 * @component
 * @param {*} param0 setSlideFinished
 * @returns {JSX.Element} React element displaying second lesson's second slide
 */
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

            <p>Model na předchozí stránce sice poskytuje vizualizaci procesu, ovšem je příliš jednoduchý a jeho tvorba nemá žádná pravidla pro to jak co znázornit. Z těchto důvodů používáme pro modelování procesů <b>modelovací notace</b>. Těch je celá řada a mezi nejznámější patří <b>UML</b> (Unified Modeling Language), <b>EPC</b> (Event Driven Process Chain), <b>BPEL</b> (Business Process Execution Language) a <b>BPMN</b> (Business Process Model and Notation).</p>

      
            <h2>BPMN (Business Process Model and Notation)</h2>

            <p>BPMN je notace, která <b>standardizuje modelování procesů</b> a je čitelná pro technické i netechnické uživatele, jelikož je <b>intuitivnější</b> než ostatní zmíněné notace.</p>

            <p>Umožňuje <b>vizuálně znázornit</b>, jak <b>jednotlivé činnosti v organizaci probíhají, kdo je vykonává a jak jsou mezi sebou propojeny</b>. Použít se dá například pro návrh a optimalizaci interních procesů organizce, automatizaci podnikových informačních systémů a analýzu efektivity procesů.</p>

            <p className="explanation">Na obrázku níže je model z předchozí stránky přepsaný do BPMN notace. Pro zachování jednoduchosti zatím nejsou dodržena všechna pravidla notace, takže model není zcela správně a je určen pouze pro prvotní porovnání obou zápisů. Je čitelnější předchozí zápis nebo tento? Který obsahuje na první pohled více informací? Kterému účastníkovi procesu (zdroji) věnujeme větší míru detailu?</p>

            <div className='bpmn-diagram-wrapper'><div
                ref={containerRef}
                className='bpmn-diagram-easyprocess'
            /></div>





    </div>   </div>
    ;
}