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

            <p><i>Modelování v BPMN je komplexní a jeho plné pochopení a naučení se všech pravidel přesahuje rozsah této aplikace. Pro Pro zachování jednoduchosti bylo vybráno několik základních prvků a pravidel notace potřebných pro pochopení dalších lekcí.</i></p>

            <div className='bpmn-diagram-description-wrapper'>
                <div className='bpmn-diagram-wrapper'><div
                    ref={containerRef}
                    className='bpmn-diagram-basics'
                /></div>
                <div className='diagram-description'>
                    {/* lit. 5 - str. 43 */}
                    <div className='diagram-description-item'><p><b>Aktivity</b> - základní elementy každého procesu. Představují práci, nějaký úkol, který je třeba vykonat pro získání chtěných výstupů. Většinou se pojmenovávají jako sloveso v infinitivu + podstatné jméno, např. odeslat zprávu nebo vybrat zboží. V diagramu vypadá jako obdélník.</p></div>
                    <div className='diagram-description-item'><p><b>Události</b> - elementy, které představují důležité věci, které se dějí před, během nebo při skončení procesu. Události se dělí na několik druhů, například:</p>
                        <ul>
                            <li><b>Spouštěcí události</b> - událost, která způsobí spuštění procesu. Čeká, až se stane něco mimo proces, a reguje na to. Značí se kruhem s jednoduchým slabým ohraničením.</li>
                            <li><b>Koncové události</b> - události, které proces spouští, ale už na ně nereaguje. Značí stav, kterého je dosaženo na konci procesu. Značí se kruhem s jednoduchým silným ohraničením.</li>
                            <li><b>Mezilehlé události</b> - události, které se vyskytují v rámci procesu. Mohou značit nějaký stav, kterého se dosáhlo. Proces je může vytvářet sám nebo se mohou samy objevit.</li>
                        </ul>
                    
                    </div>
                    <div className='diagram-description-item'><p>Rozhodovací uzly</p></div>
                    <div className='diagram-description-item'><p><b>Sekvenční toky</b> - představují logické a časové propojení jednotlivých aktivit, jejich návaznost. V diagramu vypadají jako šipky začínající v jednom elementu a končící v druhém, který na něj navazuje.</p></div>
                </div>

            </div>




    </div>   </div>
    ;
}