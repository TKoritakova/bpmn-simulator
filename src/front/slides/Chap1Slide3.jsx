import { useState } from "react";

/**
 * React component displaying first lesson's third slide. 
 * @component
 * @param {*} param0 setSlideFinished
 * @returns {JSX.Element} React element displaying first lesson's third slide
 */
export default function Chap1Slide3({ setSlideFinished }) {

    const recourcesOption = [{ text: "Dodavatel zboží", correct: false, reason: "Dodavatel zboží musí supermarketu dodat zboží, které zákazník chce nakoupit, ovšem činí tak v jiném procesu. Samotného procesu nákupu se neúčastní." },
        { text: "Centrální sklad supermarketu", correct: false, reason: "Nesouvisí přímo s vlastním nákupem, zákazník do něj nemá přístup a jeho využití není nutné k dokončení aktivit nákupu. Navíc se nejedná o účastníka, systém ani vybavení." },
        { text: "Pokladna", correct: true, reason: "Jedná se o vybavení potřebné k zaplacení zboží před opuštěním obchodu, tedy je zdrojem." },
        { text: "Prodavač/ka", correct: true, reason: "Jeden ze dvou účastníků procesu - skenuje položky nákupu před platbou a účastní se jejího provedení." },
        { text: "Uklízeč/ka", correct: false, reason: "Byť je možné, že zákazník během svého nákupu potká osobu provádějící úklid, ta se přímo neúčastní jeho nákupu a nijak výsledek procesu neovlivňuje, neb není pro aktivity potřebná. Není účastníkem procesu a tedy ani zdrojem." },
        { text: "Nákupní košík / vozík", correct: true, reason: "Je zdrojem, jelikož se jedná o vybavení usnadňující nakupování a pohyb po supermarketu při plnění aktivit (např. výběr zboží)." },
        { text: "Osobní automobil zákazníka", correct: false, reason: "Není zdrojem procesu, jelikož proces začíná až ve chvíli, kdy zákazník vstoupí do supermarketu. Cesta k němu či zpět domů není součástí procesu a tím pádem dopravní prostředek není jeho zdrojem, byť se jedná o vybavení využité k cestě." },
        { text: "Zákazník", correct: true, reason: "Je aktivním účastníkem procesu a provádí nákup, takže se řadí mezi zdroje." },
        { text: "Vedení supermarketu", correct: false, reason: "Řídí supermarket a jeho chod, ale přímo procesu nákupu se neúčastní a není tedy jeho aktivním účastníkem." }
    ];

    const [clickedOptions, setClickedOptions] = useState({});
    const [OptionExplanation, setOptionExplanation] = useState(null);


    const handleClick = (index, isCorrect, reason) => {   
        
        clickedOptions[index] = isCorrect;
        setOptionExplanation(reason);
        

        if (Object.values(clickedOptions).filter(value => value === true).length >= 4) {
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
    <div className='slide-h1-wrapper'><h1>Zdroje procesu</h1></div>
    <div className="slide-content-wrapper">

        {/* lit. 4 - str. 122 */}

        <p>Zdroje procesu <b>označují kohokoliv nebo cokoliv</b>, co je v procesu <b>nutné k provedení aktivit</b>. Zdroje můžeme dělit na <b>aktivní</b>, které jsou samy o sobě schopné plnit aktivity, a <b>pasivní</b>, které jsou používány aktivními na plnění aktivit. Zdrojem může být:</p>
        <ul>
            <li><b>Účastník procesu</b> - osoba, která se v procesu podílí na plnění aktivit, například Jan Novák. Většinou však bývá uváděn abstraktně, například jako označení role, kterou zastupuje - zákazník, zaměstnanec, prodavač.</li>
            <li><b>Systém</b> - například server nebo aplikace, které mohou vykonávat určité aktivity nebo spouštět události, případně sloužit jako pasivní nástroj.</li>
            <li><b>Vybavení</b> - pasivní nástroj, který je potřebný pro plnění aktivit, například tiskárna nebo výrobní závod.</li>
        </ul>

        <h2>Cvičení: Zdroje procesu</h2>
        <p className="explanation">Ve cvičení níže je třeba vybrat všechny zdroje procesu nákupu v supermarketu, na který nahlížíme z pohledu nakupujícího zákazníka. Jaké má účastníky a jaké vybavení je k jeho dokončení třeba?</p>


        <div className="options-section-wrapper">
            <div className="options-wrapper">
                        <p><i>Označte všechny zdroje potřebné pro proces:</i></p>
                        <div className="options">
                            {renderOptions(recourcesOption, clickedOptions, "input")}
                        </div>
                        {OptionExplanation && (<p className="option-explanation">{OptionExplanation}</p>)}
            </div>         
        </div>


        </div>
    </div>   
    ;
}