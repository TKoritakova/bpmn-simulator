import { useState } from "react";

/**
 * React component displaying first lesson's second slide. 
 * @component
 * @param {*} param0 setSlideFinished
 * @returns {JSX.Element} React element displaying first lesson's second slide
 */
export default function Chap1Slide2({ setSlideFinished }) {
    const inputAnswers = [
        { text: "Nákupní seznam", correct: true, reason: "Nákupní seznam, ať už ve fyzické podobě nebo jen jako myšlenka, je informace potřebná k nákupu. Zákazník potřebuje vědět, s čím chce odejít." },
        { text: "Dodavatel zboží", correct: false, reason: "Nemá žádný vliv na zákazníka, který si jde nakoupit. Nijak s ním neinteraguje a tím pádem není vstupem procesu nákupu." },
        { text: "Zboží v regálech", correct: true, reason: "Zboží v regálech zákazník potřebuje, aby měl co koupit, proto je vstupem procesu." },
        { text: "Hotovost/platební karta", correct: true, reason: "Zákazník potřebuje mít prostředky k zaplacení nákupu, jinak nemůže s nákupem odejít." },
        { text: "Supermarket", correct: false, reason: "Supermarket je prostředí, kde se proces odehrává, nikoliv jeho vstup." }
    ];

    const outputAnswers = [
        { text: "Zboží v tašce", correct: true, reason: "Je to výstup procesu nákupu - to, pro co zákazník do supermarketu přišel." },
        { text: "Odpad", correct: false, reason: "Odpadem může být například obalový materiál navíc. Není to výstup procesu, protože nemá žádný žádoucí přínos pro zákazníka." },
        { text: "Kamerový záznam", correct: false, reason: "Kamerový záznam je vedlejším produktem určeným zejména pro supermarket samotný. Není to však výstup určený zákazníkovi." },
        { text: "Účtenka", correct: true, reason: "Jedná se o doklad o nákupu a pro zákazníka je to žádoucí výstup." },
        { text: "Zákazník", correct: false, reason: "Zákazník jako takový není výstupem procesu, je jeho účastníkem." }
    ];


    const [clickedInputs, setClickedInputs] = useState({});
    const [inputExplanation, setInputExplanation] = useState(null);

    const [clickedOutputs, setClickedOutputs] = useState({});
    const [outputExplanation, setOutputExplanation] = useState(null);


    const handleClick = (index, isCorrect, reason, type) => {   
        if (type === "input") {
            clickedInputs[index] = isCorrect;
            setInputExplanation(reason);
        } else { 
            clickedOutputs[index] = isCorrect;
            setOutputExplanation(reason);
        }

        if (Object.values(clickedInputs).filter(value => value === true).length + Object.values(clickedOutputs).filter(value => value === true).length >= 5) {
            setSlideFinished(prev => ({
                ...prev,
                [2]: true
              }));
          
        }
       
      
    };

    const renderOptions = (options, clickedState, type) =>
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
                <div key={index} onClick={() => handleClick(index, opt.correct, opt.reason, type)}>
                    <p style={style}>{opt.text}</p>                   
                </div>
            );
        });



    return <div className="slide">
        <div className='slide-h1-wrapper'><h1>Vstupy a výstupy procesu</h1></div>
        <div className="slide-content-wrapper">

        <p>Každý proces má svůj podnět, který ho spustí, a končí nějakým výsledkem. Tomuto podnětu a výsledku se říká <b>spouštěcí a koncové události</b> a každý proces jich může, ale nemusí, mít více než jednu. Jsou to dva body, které ohraničují zbylé aktivity, události a rozhodnutí, které v rámci procesu zpracovávájí vstupy a mění je na výstupy.</p>
        <ul>
            <li>V procesu z předchozí stránky je spouštěcí událostí <b>vstup zákazníka do supermarketu</b>.</li>
            <li>Koncovou událostí jeho <b>odchod</b>.</li>
        </ul>
        <p><b>Vstupem</b> do procesu může být cokoliv, <b>co je nutné k jeho vykonání</b>. Může jít jak o informace, například údaje o zákazníkovi, tak o fyzické předměty, jako je materiál na výrobu produktu.</p>
        <p><b>Výstupem</b> procesu je <b>objekt, který má pro zákazníka hodnotu</b>, například hotový výrobek, poskytnutá služba nebo schválený dokument (smlouva).</p>

        <h2>Cvičení: Vstupy a výstupy procesu</h2>
        <p className="explanation">Ve dvou cvičeních níže je nutné se zamyslet nad tím, co jsou vstupy a výstupy procesu nákupu v supermarketu, který je v této lekci představen. Co je nutné k jeho provedení a co je naopak jeho produktem?</p>

        <div className="options-section-wrapper">
            <div className="options-wrapper">
                        <p><i>Vyberte všechny vstupy procesu:</i></p>
                        <div className="options">
                            {renderOptions(inputAnswers, clickedInputs, "input")}
                        </div>
                        {inputExplanation && (<p className="option-explanation">{inputExplanation}</p>)}
            </div>
       
            <div className="options-wrapper">
                        <p><i>Vyberte všechny výstupy procesu:</i></p>
                        <div className="options">
                            {renderOptions(outputAnswers, clickedOutputs, "output")}
                        </div>
                        {outputExplanation && (<p className="option-explanation">{outputExplanation}</p>)}
            </div>
        </div>


        
    </div>   </div>
    ;
}