import { useState, useEffect, useRef } from "react";
import BpmnViewer from 'bpmn-js';


const LOCAL_KEY_STATE = "chapter3-test-state";
const LOCAL_KEY_SUBMITTED = "chapter3-test-submitted";

/**
 * React component displaying third lesson's tenth slide. 
 * @component
 * @param {*} param0 setSlideFinished
 * @returns {JSX.Element} React element displaying third lesson's tenth slide
 */
export default function Chap3Slide10({ setSlideFinished }) {

    const containerSupermarketObjRef = useRef(null);
    const viewerSupermarketRef = useRef(null);

    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);

  
    useEffect(() => {
        const stored = localStorage.getItem(LOCAL_KEY_STATE);
        if (stored) setAnswers(JSON.parse(stored));
        const submitted = localStorage.getItem(LOCAL_KEY_SUBMITTED);
        if (submitted) setSubmitted(true);



    }, []);


    useEffect(() => {
        localStorage.setItem(LOCAL_KEY_STATE, JSON.stringify(answers));
    }, [answers]);

    const handleChange = (questionId, optionKey) => {
        setAnswers({ ...answers, [questionId]: optionKey });
    };

    const handleSubmit = () => {
        setSubmitted(true);
        localStorage.setItem(LOCAL_KEY_SUBMITTED, true);
        window.dispatchEvent(new Event("storageUpdated"));
        setSlideFinished(prev => ({
          ...prev,
          [10]: true
        }));
    };

  const questions = [
    {
      id: 1,
      question: "Co je hlavním cílem simulace procesů?",
      options: {
        a: "Zaznamenat skutečný průběh procesu v reálném čase.",
        b: "Vytvořit nový proces bez ohledu na současné fungování.",
        c: "Otestovat chování procesu v různých podmínkách bez rizika zásahu do reality.",
        d: "Nahradit lidské zdroje automatickým systémem.",
      },
      correct: "c",
      explanation: "Simulace procesů provádí výpočty nad konkrétním modelem procesu a nastavenými vstupními daty. Rozhodně tak není automatickým systémem, který má nahradit lidské zdroje, a zároveň nezaznamenává průběh v reálném čase. Jejím cílem též není tvoření nových procesů, pracuje již se stávajícími, a tedy správnou odpovědí je, že se snaží otestovat chování daného procesu na různých vstupních datech (=podmínkách) bez rizika toho, že testování bude mít dopad na realitu a například tržby společnosti."
    },
    {
        id: 2,
        question: "Které rozdělení je vhodné použít, pokud chceme simulovat náhodné příchody zákazníků s nejvyšší pravděpodobností krátce po předchozím?",
        options: {
          a: "Fixní",
          b: "Exponenciální",
          c: "Normální",
          d: "Žádné z řečených",
        },
        correct: "b",
        explanation: "Fixní rozdělení má mezi příchody pevně stanovené hodnoty, tedy správnou odpovědí není. Normální rozdělení má mezi příchody časy, které jsou na číselné ose rozmístěné okolo jeho střední hodnoty. Exponenciální rozdělení naopak říká, že je větší šance, že nový zákazník přijde hned po tom předchozím, než dlouho po něm - a proto je tedy i správnou odpovědí. "
      },
      {
        id: 3,
        question: "Co určuje kapacita zdroje v simulaci?",
        options: {
          a: "Číslo označující, kolik osob či věcí, které plní úlohu daného zdroje, je k dispozici.",
          b: "Výši mzdy tohoto zdroje.",
          c: "Maximální dobu, po kterou může pracovat.",
          d: "Počet dní v týdnu, které pracuje."
        },
        correct: "a",
        explanation: "Kapacita zdroje určuje například to, kolik lidí pracujících na pozici prodavač máme k dispozici - tedy ne jejich mzdu nebo pracovní dobu. Prodavač je role - účastník procesu."
      },
      {
        id: 4,
        question: "Jaký vstup v simulačním scénáři pomáhá zohlednit pracovní dobu zdrojů?",
        options: {
          a: "Měna simulace",
          b: "Počet instancí",
          c: "Začátek simulace",
          d: "Rozdělení příchodů instancí"
        },
        correct: "c",
        explanation: "Pracovní doba zdrojů je navázaná na konkrétní dny v týdnu a hodiny. Nastavením začátku simulace můžeme ovlivnit, jak bude simulace na svém začátku probíhat - je rozdíl, když pro zdroj pracující od pondělí do pátku spustíme proces v pondělí ráno a v pátek po obědě. Tento údaj tedy zohledňuje pracovní dobu zdrojů."


      },
      {
        id: 5,
        question: "Změním v simulaci pracovní dobu zdroje z 8:00–16:00 na 6:00–18:00. Co z následujícího můžu očekávat, že se nejpravděpodobněji stane?",
        options: {
          a: "Zdrojům se sníží jejich vytížení.",
          b: "Prodlouží se průměrné čekací časy u všech aktivit.",
          c: "Sníží se celkový čas běhu simulace, který vzniká součtem trvání všech instancí.",
          d: "Trvání jednotlivých instancí se zkrátí, pokud byly dříve velké čekací doby na zdroje.",
        },
        correct: "d",
        explanation: "Prodloužením pracovní doby zdroji jim poskytnu více času na plnění úkolů, které tak stihnou splnit dříve. Mohu tím zkrátit trvání instancí procesů, jelikož aktivity budou čekat kratší časy na provedení. Například kdyby pracovní doba skončila v 16:00, zdroj by stihl provést jen čtyři úkoly a pátý v řadě by tak čekal do dalšího pracovního dne. V prodloužené pracovní době ho stihne ale splnit ještě ten den a o čas mimo pracovní dobu se může zkrátit trvání instance procesu."
      },
      {
        id: 6,
        question: "Simulace ukázala, že aktivita A má průměrné čekání 14 minut a aktivita B jen 2 minuty. Co je z toho možné vyvodit?",
        options: {
          a: "Aktivita B je úzké místo.",
          b: "Aktivitu B v procesu nepotřebujeme.",
          c: "Aktivita A bude levnější.",
          d: "Aktivita A má problém s dostupností zdrojů.",
        },
        correct: "d",
        explanation: "O ceně či samotné době trvání v otázce není nic řečeno, což vylučuje první a třetí odpověď, nemáte totiž jak posoudit jejich pravdivost. Stejně tak není z čeho usoudit, že je aktivita B nepotřebná. Z dlouhé čekací doby aktivity A však lze soudit, že není dostatek zdrojů nebo pracují příliš pomalu a tím se jim hromadí úkoly."
      },
  ];


    return <div className="slide">
    <div className='slide-h1-wrapper'><h1>Závěrečné shrnutí</h1></div>
    <div className="slide-content-wrapper ">

    

       
    {questions.map((q) => (
        <div key={q.id} className="question">
          <p>{q.id}. {q.question}</p>
          <div className="question-answers-wrapper">
            {Object.entries(q.options).map(([key, value]) => (
                <div className="answer-wrapper" key={key}>
                    <input
                        type="radio"
                        name={`question-${q.id}`}
                        value={key}
                        id={`${q.id}-${key}`}
                        checked={answers[q.id] === key}
                        onChange={() => handleChange(q.id, key)}
                        disabled={submitted}
                    />
                    <label htmlFor={`${q.id}-${key}`} style={{fontWeight: answers[q.id] === key ? "bold" : "normal"}} >{`${key}. ${value}`}</label>
                </div>
            ))}
            {submitted && (
                <p style={{ color: answers[q.id] === q.correct ? "#30a64f" : "#a63030" }}>
                {answers[q.id] === q.correct ? "Správně" : "Špatně"} – {q.explanation}
                </p>
            )}
        </div></div>
      ))}
      {!submitted ? (
        <button onClick={handleSubmit}>Odeslat test</button>
      ) : (
        <div className="test-submitted"><p>Test byl odeslán. Výsledky jsou uloženy.</p></div>
      )}

        </div>
    </div>   
    ;
}