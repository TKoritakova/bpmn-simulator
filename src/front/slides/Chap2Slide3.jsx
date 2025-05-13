import { useState, useEffect, useRef } from 'react';
import BpmnViewer from 'bpmn-js';

export default function Chap2Slide3({ setSlideFinished }) {

    const options = [{ text: "Přeplněný obchod", correct: false, reason: "V procesu není nikde řešen počet lidí v supermarketu." },
        { text: "Požadované zboží je vyprodané", correct: true, reason: "Na začátku procesu je rozhodovací blok, který řeší, jestli je položka dostupná. Pokud není, zákazník přeskočí na další položku svého nákupního seznamu. V realitě by nejspíše hledal alternativu ke své položce než rovnou přešel k dalšímu nákupu, což dává možnost pro další rozšíření tohoto procesu." },
        { text: "Dlouhá fronta u pokladny", correct: false, reason: "Jediná aktivita, která se týká fronty, je její vystání. Nijak není řešeno co dělat, pokud je dlouhá." },
        { text: "Nedostupné nákupní košíky", correct: false, reason: "Košíky jsou v tomto modelu zmíněny pouze v souvislosti vkládání zboží do nich, ale řešení jejich nedostupnosti zmíněno není." },
        { text: "Špatně naskenované zboží u pokladny", correct: true, reason: "V závěrečné části diagramu si zákazník kontroluje svůj nákup a pokud není v pořádku, jde provést reklamaci." },
        { text: "Nedostupné tašky u pokladen", correct: false, reason: "Tašky v tomto modelu procesu nejsou vůbec zmíněny." },

    ];

    const [clickedOptions, setClickedOptions] = useState({});
    const [OptionExplanation, setOptionExplanation] = useState(null);

    const containerElementsRef = useRef(null);
    const viewerElementsRef = useRef(null);
    const containerSupermarketRef = useRef(null);
    const viewerSupermarketRef = useRef(null);

    useEffect(() => {
        fetch('bpmn-basics.bpmn') 
            .then(res => res.text())
            .then(text => {
                
                if (!viewerElementsRef.current) {
                    viewerElementsRef.current = new BpmnViewer({ container: containerElementsRef.current });
                }
                viewerElementsRef.current.importXML(text).then(async () => {
                    viewerElementsRef.current.get('canvas').zoom('fit-viewport');                
                           
                }).catch(err => {
                    console.error('Chyba při načítání BPMN XML:', err);
                });
            })
            .catch(err => {
            console.error('Chyba při načítání BPMN souboru:', err);
            });


        fetch('supermarket-ver1.bpmn') 
            .then(res => res.text())
            .then(text => {
                
                if (!viewerSupermarketRef.current) {
                    viewerSupermarketRef.current = new BpmnViewer({ container: containerSupermarketRef.current });
                }
                viewerSupermarketRef.current.importXML(text).then(async () => {
                    viewerSupermarketRef.current.get('canvas').zoom('fit-viewport');                
                           
                }).catch(err => {
                    console.error('Chyba při načítání BPMN XML:', err);
                });
            })
            .catch(err => {
            console.error('Chyba při načítání BPMN souboru:', err);
            });
      
              
    }, []);

    const handleClick = (index, isCorrect, reason) => {   
        
        clickedOptions[index] = isCorrect;
        setOptionExplanation(reason);
        

        if (Object.values(clickedOptions).filter(value => value === true).length >= 2) {
            setSlideFinished(prev => ({
                ...prev,
                [3]: true
              }));
          
        }    
      
    };

    const renderOptions = (options, clickedState) =>
        options.map((opt, index) => {
            const clicked = clickedState[index];
            let style = {};
            if (clicked !== null && clicked !== undefined) {
                style = {
                    backgroundColor: clicked ? "#3ac961" : "#de4545",
                    border: "2px solid",
                    borderColor: clicked ? "#30a64f" : "#a63030",
                    
                };
            }

            return (
                <div key={index} onClick={() => handleClick(index, opt.correct, opt.reason)}>
                    <p style={style}>{opt.text}</p>                   
                </div>
            );
        });

    

    return <div className="slide">
        <div className='slide-h1-wrapper'><h1>Základní prvky BPMN</h1></div>
        <div className='slide-content-wrapper'>

            <p><i>Modelování v BPMN je komplexní a jeho plné pochopení a naučení se všech pravidel přesahuje rozsah této aplikace. Pro zachování jednoduchosti bylo vybráno několik základních prvků a pravidel notace potřebných pro pochopení dalších lekcí.</i></p>

            <div className='bpmn-diagram-description-wrapper'>
                <div className='bpmn-diagram-wrapper'>
                    <div
                    ref={containerElementsRef}
                    className='bpmn-diagram-basics'
                    />
                </div>
                <div className='diagram-description'>
                    {/* lit. 5 - str. 43 */}
                    <div className='diagram-description-item'><p><b>Aktivity</b> - základní elementy každého procesu. Představují práci, nějaký úkol, který je třeba vykonat pro získání chtěných výstupů. Většinou se pojmenovávají jako sloveso v infinitivu + podstatné jméno, např. odeslat zprávu nebo vybrat zboží. V diagramu vypadají jako obdélník se zaoblenými rohy.</p></div>
                    <div className='diagram-description-item'><p><b>Události</b> - elementy, které představují důležité věci, které se dějí před, během nebo při skončení procesu. Události se dělí na několik druhů, například:</p>
                        <ul>
                            <li><b>Spouštěcí událost</b> - událost, která způsobí spuštění procesu. Čeká, až se stane něco mimo proces, a reaguje na to. Značí se kruhem s jednoduchým slabým ohraničením.</li>
                            <li><b>Koncová událost</b> - událost, kterou proces spouští, ale už na ni nereaguje. Značí stav, kterého je dosaženo na konci procesu. Značí se kruhem s jednoduchým silným ohraničením.</li>
                            <li><b>Mezilehlá událost</b> - událost, která se vyskytuje v rámci procesu. Může značit nějaký stav, kterého se dosáhlo. Proces ji může vytvářet sám nebo se může sama objevit. Značí se kruhem s dvojitým slabým ohraničením.</li>
                        </ul>
                        <p>Události dále mohou mít své typy podle toho, jakou událost sledují, například:</p>
                        <ul>
                            <li><b>Zpráva</b> - zpráva je událost, která představuje komunikaci. Je to každá akce, která je určena specifickému příjemci a obsahuje či reprezentuje informace pro něj. Značí se přidáním obálky do kruhu události. Prázdná obálka je událost přijímající zprávu, plná odesílající zprávu.</li>
                            <li><b>Časovač</b> - událost, která pracuje s reálným časem. Použít se dá například pro spuštění procesu v určitý čas, jednorázově či opakovaně, pro vyčkání na příchod určitého času v procesu nebo pro čekání, až uplyne určitý časový interval. Značí se přidáním symbolu hodin do kruhu události.</li>
                        </ul>
                    </div>
                    <div className='diagram-description-item'><p><b>Rozhodovací větvení</b> - elementy, které podle podmínek na základě dat dostupných v procesu, větví proces. Značí se kosočtvercem a též je jich více druhů, například:</p>
                        <ul>
                            <li><b>Exkluzivní větvení (XOR)</b> - větvení, které se podle dat rozhodne, kterou z výstupních cest použije, přičemž vybírá vždy jen jednu z nich. Od jiných větvení se liší přidáním X do kosočtverce a v diagramu ho většinou doplníme otázkou.</li>
                            <li><b>Paralelní větvení (AND)</b> - větvení, které aktivuje všechny své výstupní cesty a používá se pro paralelizaci. V diagramu se značí přidáním plus do kosočtverce.</li>
                        </ul>
                    </div>
                    <div className='diagram-description-item'><p><b>Sekvenční toky</b> - představují logické a časové propojení jednotlivých aktivit, jejich návaznost. V diagramu vypadají jako šipky začínající v jednom elementu a končící v druhém, který na něj navazuje.</p></div>
                </div>

            </div>

            <h2>Příklad: Proces nákupu v supermarketu</h2>
            <p className='explanation'>Prohlédněte si upravený diagram procesu nákupu v supermarketu. Ten se v tomto případě zaměřuje pouze na pohled zákazníka, což je zcela v pořádku, protože procesy mohou mít různou úroveň míry detailu pro jeden či více zdrojů. Po prohlédnutí diagramu vyberte níže všechny možnosti, se kterými tento diagram pracuje a je o jejich řešení rozšířen. Možnosti vychází z problémů, které jsou popsány v první vizualizaci procesu.</p>

            <div className='bpmn-diagram-wrapper'><div
                    ref={containerSupermarketRef}
                    className='bpmn-diagram-supermarketver1'
                /></div>


            <div className="options-section-wrapper">
                <div className="options-wrapper">
                    <div className="options">
                        {renderOptions(options, clickedOptions, "input")}
                    </div>
                    {OptionExplanation && (<p className="option-explanation">{OptionExplanation}</p>)}
                </div>         
            </div>


    </div>   </div>
    ;
}