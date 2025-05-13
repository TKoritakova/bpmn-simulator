import { useState, useEffect, useRef } from 'react';
import BpmnViewer from 'bpmn-js';

export default function Chap2Slide4({ setSlideFinished }) {

    const containerPoolsRef = useRef(null);
    const viewerPoolsRef = useRef(null);
    const containerDataObjRef = useRef(null);
    const viewerDataObjRef = useRef(null);
    const containerSupermarketObjRef = useRef(null);
    const viewerSupermarketRef = useRef(null);

    const options = [{ text: "Účtenka je datový objekt.", correct: true, reason: "Ano, účtenka je v modelu zobrazena jako datový objekt." },
        { text: "V modelu jsou tři účastníci - zákazník, prodavač a manažer vyřizující reklamace.", correct: false, reason: "Ne, v modelu jsou pouze dva bazény a to zákazník a supermarket. Je možné předpokládat, že bazén supermarketu je dále dělen na na dráhy prodavače a manažera, ale to v modelu již není." },
        { text: "Zákazník přichází do obchodu s nákupním seznamem. Kouká, jestli je položka v něm dostupná, pokud ano, vybere ji a pokračuje k další.", correct: true, reason: "Ano, popsané se nachází na začátku modelu." },
        { text: "Zákazník nemá možnost reklamovat špatně namarkovaný nákup nebo špatné zboží.", correct: false, reason: "Ne, u konce procesu má zákazník po kontrole svého nákupu možnost vyřídit reklamaci." },
        { text: "Zákazník si vybírá nejkratší frontu, do které se postaví.", correct: false, reason: "Ne, taková aktivita nebo větvení se v modelu nenachází." },
        { text: "Zákazník musí vždy reklamovat své zboží.", correct: false, reason: "Nemusí, model obsahuje větvení, a pokud je jeho nákup v pořádku, odchází ze supermarketu rovnou." },

    ];

    const [clickedOptions, setClickedOptions] = useState({});
    const [OptionExplanation, setOptionExplanation] = useState(null);

    useEffect(() => {
        fetch('bpmn-pools.bpmn') 
            .then(res => res.text())
            .then(text => {
                
                if (!viewerPoolsRef.current) {
                    viewerPoolsRef.current = new BpmnViewer({ container: containerPoolsRef.current });
                }
                viewerPoolsRef.current.importXML(text).then(async () => {
                    viewerPoolsRef.current.get('canvas').zoom('fit-viewport');                
                           
                }).catch(err => {
                    console.error('Chyba při načítání BPMN XML:', err);
                });
            })
            .catch(err => {
            console.error('Chyba při načítání BPMN souboru:', err);
            });

            fetch('bpmn-dataobjects.bpmn') 
            .then(res => res.text())
            .then(text => {
                
                if (!viewerDataObjRef.current) {
                    viewerDataObjRef.current = new BpmnViewer({ container: containerDataObjRef.current });
                }
                viewerDataObjRef.current.importXML(text).then(async () => {
                    viewerDataObjRef.current.get('canvas').zoom('fit-viewport');                
                           
                }).catch(err => {
                    console.error('Chyba při načítání BPMN XML:', err);
                });
            })
            .catch(err => {
            console.error('Chyba při načítání BPMN souboru:', err);
            });
    
            fetch('supermarket-ver2.bpmn') 
            .then(res => res.text())
            .then(text => {
                
                if (!viewerSupermarketRef.current) {
                    viewerSupermarketRef.current = new BpmnViewer({ container: containerSupermarketObjRef.current });
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
                    [4]: true
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
        <div className='slide-h1-wrapper'><h1>Pokročilé prvky BPMN</h1></div>
        <div className='slide-content-wrapper'>

    

            <div className='bpmn-diagram-description-wrapper'>
                <div className='diagram-description'>
                    {/* lit. 5 - str. 56 */}
                    <div className='diagram-description-item'><p><b>Bazén</b> - bazén představuje zdroj procesu a nejčastěji osobu, která je zodpovědná za provádění úkolů v rámci procesu - zdroj procesu, nejčastěji účastník nebo systém. Do bazénů vkládáme konkrétní aktivity a každá aktivita smí být umístěna jen v jednom bazénu. Bazén se značí obdélníkem s oddělenou částí na začátku, kam se vepisuje, co představuje. Je k němu možné přistupovat jako k tzv. black boxu, tedy nevkládat do něj další elementy. Toho se využívá zejména pokud proces představuje nějakou externí stranu, u níž si nejsme jistí, jak proces na jejich straně funguje.</p> 
                    </div>
                    <div className='diagram-description-item'><p><b>Dráha</b> - dráha je další dělení rolí a zodpovědností v rámci bazénu. Nemusí být využita, ale pokud je, můžeme si tedy představit jako bazén například supermarket a jednotlivé dráhy v něm mohou být prodavač a manažer. Nejčastěji jsou do nich vepisovány pracovní role (prodavač), názvy oddělení (účetní oddělení) a aplikace (informační systém). I v tomto případě smí být aktivita jen v jedné dráze.</p></div>
                    <div className='diagram-description-item'><p><b>Zprávové toky</b> - zprávové toky představují komunikaci mezi jednotlivými bazény. V rámci jednoho bazénu se používají sekvenční toky, ale pro komunikaci za jeho hranicemi je třeba využít zpráv. Ty se značí čárkovanou šipkou s kolečkem u výchozího elementu a šipkou u jeho následníka.</p></div>
                    <div className='diagram-description-item'><p><b>Datové objekty</b> - datové objekty představují všechny formy informací bez ohledu na jejich fyzickou podobu, ve které se objevují. Mohou to být různé dokumenty, abstraktní informace nebo elektronické datové záznamy. Zobrazují se obdélníkem s ohnutým rohem.</p></div>
                    <div className='diagram-description-item'><p><b>Úložiště</b> - představují místo, kam se informace ukládají mimo proces. Mohou být zobrazena jako válec stejně jako na přiložené ukázce.</p></div>
                </div>

                <div>
                    <div className='bpmn-diagram-wrapper'><div
                        ref={containerPoolsRef}
                        className='bpmn-diagram-pools'
                        />
                    </div>
                    <div className='bpmn-diagram-wrapper'>
                        <div
                        ref={containerDataObjRef}
                        className='bpmn-diagram-dataobj'
                        />
                    </div>
                </div>

            </div>


            <h2>Příklad: Proces nákupu nákupu v supermarketu</h2>
            <p className='explanation'>Prohlédněte si znovu upravený diagram procesu nákupu v supermarketu. I tentokrát se soustředí spíše na pohled zákazníka, ale byla přidána komunikace se supermarketem, který je zde ve formě black boxu, a tedy neřešíme, jak proces konkrétně vypadá z jejich pohledu. Po prohlédnutí vyberte níže všechny možnosti, které o modelu platí.</p>

            <div className='bpmn-diagram-wrapper'>
                <div
                ref={containerSupermarketObjRef}
                className='bpmn-diagram-supermarketver2'
                />
            </div>


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