import { useState } from "react";

export default function Chap1Slide3({ setSlideFinished }) {

    const recourcesOption = [{ text: "Dodavatel zboží", correct: false, reason: "Dodavatel zboží musí supermarketu dodat zboží, které zákazník chce nakoupit, ovšem činí tak v jiném procesu. Samotného procesu nákupu se neúčastní." },
        { text: "Centrální sklad supermarketu", correct: false, reason: "Nesouvisí přímo s vlastním nákupem, zákazník do něj nemá přístup a jeho využití není nutné k dokončení aktivit nákupu." },
        { text: "Pokladna", correct: true, reason: "Je potřebná k zaplacení zboží před opuštěním obchodu, tedy je zdrojem." },
        { text: "Prodavač/ka", correct: true, reason: "Skenuje položky nákupu před platbou a účastní se jejího provedení, je zdrojem." },
        { text: "Uklízeč/ka", correct: false, reason: "Byť je možné, že zákazník během svého nákupu potká osobu provádějící úklid, ta se přímo neúčastní jeho nákupu a nijak výsledek procesu neovlivňuje, neb není pro aktivity potřebná." },
        { text: "Nákupní košík / vozík", correct: true, reason: "Je zdrojem, jelikož usnadňuje nakupování a pohyb po supermarketu při plnění aktivit (např. výběr zboží)." },
        { text: "Osobní automobil zákazníka", correct: false, reason: "Není zdrojem procesu, jelikož proces začíná až ve chvíli, kdy zákazník vstoupí do supermarketu. Cesta k němu či zpět domů není součástí procesu a tím pádem dopravní prostředek není jeho zdrojem." },
        { text: "Zákazník", correct: true, reason: "Je účastníkem procesu a provádí nákup, takže se řadí mezi zdroje." },
        { text: "Vedení supermarketu", correct: false, reason: "Řídí supermarket a jeho chod, ale přímo procesu nákupu se neúčastní." }
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

        <p>Zdroje procesu označují kohokoliv nebo cokoliv, co je v procesu nutné k provádění aktivit. Zdroje můžeme dělit na aktivní, které jsou samy o sobě schopné plnit aktivity, a pasivní, které jsou používány aktivními na plnění aktivit. Zdrojem může být:</p>
        <ul>
            <li>Účastník procesu - osoba, která se v procesu podílí na plnění aktivit, například Jan Novák. Většinou však bývá uváděn abstraktně, například jako označení role - zákazník, zaměstnanec, prodavač.</li>
            <li>Systém - například server nebo aplikace, které mohou vykonávat určité aktivity nebo spouštět události, případně sloužit jako pasivní nástroj.</li>
            <li>Vybavení - pasivní nástroj, který je potřebný pro plnění aktivit, například tiskárna nebo výrobní závod.</li>
        </ul>

        <div className="options-section-wrapper">
            <div className="options-wrapper">
                        <p><i>Označte všechny zdroje potřebné pro proces nákupu v supermarketu:</i></p>
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