import { useState, useEffect } from "react";

export default function Chap1Slide4({ setSlideFinished }) {

    
    const texts = [{
        heading: 'Klíčový ukazatel výkonnosti',
        shortcut: 'KPI, Key Performance Indicator',
        text: 'Jedná se o konkrétní a měřitelnou hodnotu, kterou určujeme efektivitu a výkonnost procesu. Zaměřuje se na hodnocení operativích veličin, například celkovou dobu trvání procesu, počet chyb v procesu či náklady na jeho provedení. Umožňuje tak sledovat průběžný výkon procesu a identifikovat slabá místa.<br><br>Z každé operatvní veličiny - tedy času, nákladů a kvality - lze získat více ukazatelů. K tomu slouží agregační funkce, které se volí na základě toho, co je pro proces vhodné sledovat. Příkladem může být průměrný čas nákupu, počet zákazníků za den nebo maxinimální a minimální doba strávená u pokladny.',
    },{
        heading: 'Klíčový ukazatel cíle',
        shortcut: 'KGI, Key Goal Indicator',
        text: 'Jedná se o měřitelný ukazatel, který je navázaný na strategický či dlouhodobý cíl organizace. Místo průběhu se zaměřuje na výsledek. KGI tak může být formulován jako: Získat do konce kalendářního roku 500 nových registrací do věrnostního klubu.',
    }]

    const [openTooltips, setOpenTooltips] = useState(Array(texts.length).fill(false));
    const [visitedTooltips, setVisitedTooltips] = useState(Array(texts.length).fill(false));

    const toggleTooltip = (index) => {
        const updatedOpen = [...openTooltips];
        updatedOpen[index] = !updatedOpen[index];
        setOpenTooltips(updatedOpen);

        const updatedVisited = [...visitedTooltips];
        updatedVisited[index] = true;
        setVisitedTooltips(updatedVisited);
        };

    useEffect(() => {
        const all = visitedTooltips.every(Boolean);
        
        setSlideFinished(prev => ({
            ...prev,
            [4]: all
        }));
    
    }, [visitedTooltips]);


    return <div className="slide">
    <div className='slide-h1-wrapper'><h1>Měření efektivity procesu</h1></div>
    <div className="slide-content-wrapper">

        {/* lit. 4 - 86 */}
<p>Jednou z dalších charakteristik, které proces musí splňovat, je měřitelnost. Bez toho, aby byl měřitelný, není možné sledovat, jestli je efektivní, a zlepšovat ho. Nejčastěji u procesů sledujeme jejich časový průběh, cenu a kvalitu výstupů. Pro měření a sledování těchto veličin používáme procesní metriky, KPI a KGI.</p>
        

        <div className="text-tooltip-wrapper">
        {texts.map((text, index) => (
          <div
            key={index}
            className="text-tooltip-container"
            onClick={() => toggleTooltip(index)}
            
          >
            <p className="heading-tooltip">{text.heading}</p>
            {openTooltips[index] && (
              <div className="tooltip">
                
                <p className="tooltip-shortcut">({text.shortcut})</p>
                
                <p dangerouslySetInnerHTML={{ __html: text.text }} />
              </div>
            )}
          </div>
        ))}

        </div>


        </div>
    </div>   
    ;
}