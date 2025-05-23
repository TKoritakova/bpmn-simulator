import { useState, useEffect } from "react";

/**
 * React component displaying first lesson's fourth slide. 
 * @component
 * @param {*} param0 setSlideFinished
 * @returns {JSX.Element} React element displaying first lesson's fourth slide
 */
export default function Chap1Slide4({ setSlideFinished }) {

    
    const texts = [{
        heading: 'Klíčový ukazatel výkonnosti',
        shortcut: 'KPI, Key Performance Indicator',
        text: 'Jedná se o konkrétní a měřitelnou hodnotu, kterou <b>měříme efektivitu a výkonnost procesu</b>. Zaměřuje se na hodnocení <b>operativních veličin</b>, například celkovou dobu trvání procesu, počet chyb v procesu či náklady na jeho provedení. Umožňuje tak <b>sledovat průběžný výkon procesu</b> a <b>identifikovat slabá místa</b>.<br><br>Z každé operativní veličiny - tedy <b>času, nákladů a kvality</b> - lze získat více ukazatelů. K tomu slouží <b>agregační (sdružovací) funkce</b>, které se volí na základě toho, co je pro proces vhodné sledovat. Příkladem může být průměrný čas nákupu, počet zákazníků za den nebo maximální a minimální doba strávená u pokladny.',
    },{
        heading: 'Klíčový ukazatel cíle',
        shortcut: 'KGI, Key Goal Indicator',
        text: 'Jedná se o měřitelný ukazatel, který je <b>navázaný na strategický či dlouhodobý cíl organizace</b>. Místo průběhu se <b>zaměřuje na výsledek</b>. KGI tak může být formulován jako: Získat do konce kalendářního roku 500 nových registrací do věrnostního klubu.',
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
<p>Jednou z dalších charakteristik, které proces musí splňovat, je <b>měřitelnost</b>. Bez toho, aby byl měřitelný, není možné sledovat, jestli je efektivní, a zlepšovat ho. Nejčastěji u procesů <b>sledujeme jejich časový průběh, cenu a kvalitu výstupů</b>. Pro měření a sledování těchto veličin používáme <b>procesní metriky, KPI a KGI</b>.</p>
        
<p className="action-label"><i>Kliknutím na jednotlivé pojmy zobrazíte jejich podrobnosti.</i></p>


        <div className="text-tooltip-wrapper">
        {texts.map((text, index) => (
          <div
            key={index}
            className="text-tooltip-container"
            onClick={() => toggleTooltip(index)}
            
          >
            <p className="heading-tooltip"><b>{text.heading}</b></p>
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