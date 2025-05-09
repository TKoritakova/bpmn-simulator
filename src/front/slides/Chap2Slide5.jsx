import { useState, useEffect, useRef } from "react";
import BpmnViewer from 'bpmn-js';


const LOCAL_KEY_STATE = "chapter2-test-state";
const LOCAL_KEY_SUBMITTED = "chapter2-test-submitted";

export default function Chap2Slide5({ setSlideFinished }) {

    const containerSupermarketObjRef = useRef(null);
    const viewerSupermarketRef = useRef(null);

    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);

  
    useEffect(() => {
        const stored = localStorage.getItem(LOCAL_KEY_STATE);
        if (stored) setAnswers(JSON.parse(stored));
        const submitted = localStorage.getItem(LOCAL_KEY_SUBMITTED);
        if (submitted) setSubmitted(true);


        fetch('supermarket-ver3.bpmn') 
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
          [5]: true
        }));
    };

  const questions = [
    {
      id: 1,
      question: "Který z elementů není v modelu použit?",
      options: {
        a: "Událost",
        b: "Zprávový tok",
        c: "Paralelní větvení",
        d: "Exkluzivní větvení",
      },
      correct: "c",
      explanation: "Mezi události se počítají i spouštěcí a koncové události, tedy tento element se v procesu vyskytuje. Zprávový tok je použit placení u klasické pokladny a vyřízení reklamace. Všechny použité větvení jsou exkluzivní, takže správnou odpovědí je, že model neobsahuje paralelní větvení."
    },
    {
        id: 2,
        question: "K čemu v modelu slouží exkluzivní větvení s otázkou „Je zboží dostupné?“?",
        options: {
          a: "Rozhoduje, jestli zákazník opustí supermarket.",
          b: "Rozhoduje, jestli zákazník může vložit dané zboží do košíku.",
          c: "Rozhoduje, jestli zákazník půjde vyřídit reklamaci.",
          d: "Rozhoduje, jestli zákazník bude spokojený.",
        },
        correct: "b",
        explanation: "větvení se nachází na samém začátku modelu ve fázi vybírání zboží a slouží k určení toho, jestli zákazník najde danou položku v regálech. Ostatní možnosti popisují jiná místa v modelu nebo se v něm vůbec nevyskytují."
      },
      {
        id: 3,
        question: "Která z následujících aktivit je vykonána pouze v případě, že zaměstnanec špatně naskenuje položky nákupu?",
        options: {
          a: "Zaplatit u samoobslužné pokladny",
          b: "Zkontrolovat nákup",
          c: "Vložit zboží do košíku",
          d: "Vyřídit reklamaci"
        },
        correct: "d",
        explanation: "Z otázky je patrné, že aktivita musí být po fázi placení, čímž se automaticky vyloučí všechny možnosti, které jsou před ním, tedy vkládání zboží do košíku a zaplacení u samoobslužné pokladny. Kontrola nákupu se odehraje po platbě u klasické poklady vždy a na základě jejího výsledku se rozhoduje, jestli dojde k reklamaci. K té se přistoupí právě v okamžiku, kdy je nákup špatně naskenován."
      },
      {
        id: 4,
        question: "Kolika způsoby je možné podle tohoto modelu zaplatit?",
        options: {
          a: "0",
          b: "1",
          c: "2",
          d: "3"
        },
        correct: "c",
        explanation: "V modelu jsou dvě možnosti platby - u klasické a samoobslužné pokladny."


      },
      {
        id: 5,
        question: "Co se stane po dokončení aktivity zaplacení na klasické pokladně, pokud je vše v pořádku?",
        options: {
          a: "Zákazník jde reklamovat nákup.",
          b: "Proces začne od začátku.",
          c: "Zákazník rovnou odchází ze supermarketu.",
          d: "Zákazník zkontroluje svůj nákup a odchází ze supermarketu.",
        },
        correct: "d",
        explanation: "Jak je patrné z grafu, po zaplacení na klasické pokladně zákazník vždy pokračuje kontrolou svého nákupu bez ohledu na to, jestli je nákup v pořádku - zatím totiž neví, jestli je. Pokud po kontrole zákazník shledá, že žádný problém během jeho nákupu nenastal, odchází."
      },
      {
        id: 6,
        question: "Jak model co nejlépe upravit, aby řešil i následující: pokud zákazník nemá dostupný preferovaný produkt, hledá nejprve jeho alternativy než se případně posune na další produkt; zákazník si volí pokladnu podle toho, kde je nejmenší fronta; pokud na začátku nejsou dostupné košíky, zákazník čeká, až budou dostupné.",
        options: {
          a: "Na začátek procesu se přidá exkluzivní větvení, která se bude ptát, zda jsou dostupné košíky. Pokud ano, bude aktivována cesta k existujícímu větvení zjišťujícímu, zda je dostupné zboží. Pokud ne, bude aktivována cesta k časovači, který bude vyčkávat na volné košíky, a následně se též napojí na existující větvení o dostupnosti zboží. Větev o nedostupnosti zboží z tohoto větvení rozšíříme o aktivitu hledání alternativy. Před výběr způsobu platby přidáme aktivitu kontroly délky front a stávající exkluzivní větvení upravíme tak, aby reagovalo na délku fronty změnou jeho otázky.",
          b: "Na začátek procesu se přidá paralelní větvení. Jedna její větev bude aktivovat cestu k existujícímu větvení zjišťujícímu, zda je dostupné zboží. Druhá bude mít cestu k časovači, který bude vyčkávat na volné košíky a jakmile bude nějaký volný, vezme si ho. Obě větve se spojí před výběrem způsobu platby, kam přidáme aktivitu kontroly délky front a stávající exkluzivní větvení upravíme tak, aby reagovalo na délku fronty změnou jeho otázky.",
          c: "Na začátek procesu se přidá aktivita vyčkat na košík. Větev o nedostupnosti zboží z prvního exkluzivního větvení rozšíříme o aktivitu hledání alternativy, za kterou ještě umístíme ještě exkluzivní větvení. To se bude ptát, jestli zákazník zboží našel a zda ho chce, pokud ano, zboží vloží do košíku. Jinak pokračuje k další položce nákupního seznamu. Před výběr způsobu platby přidáme aktivitu kontroly délky front.",
          d: "Na začátek procesu se přidá aktivita vyčkat na košík následovaná aktivitou vzít si košík. Větev o nedostupnosti zboží rozšíříme o exkluzivní větvení, které bude řešit, zda je dostupná alternativa. Pokud ano, vložíme ji do košíku, pokud ne, pokračujeme k další položce nákupu. Před placením na klasické pokladně přidáme aktivitu kontroly délky front.",
        },
        correct: "a",
        explanation: "Z nabízených možností je nejlepší možnost A, která nějakým způsobem plní alespoň částečně všechny požadavky. Možnost B řeší dostupnost košíků nesprávným způsobem, protože zákazník na košík nečeká a jde rovnou nakupovat, stejně jako vůbec nezohledňuje hledání alternativních produktů. Možnost C má na začátku aktivitu vyčkat na košík, což by v ideálním případě měl být spíše časovač. Zároveň přisuzuje jednomu větvení dvě rozhodnutí, což by mělo být řešeno dvěmi, a nakonec sice kontroluje délku front, ale už na základě této informace nic nedělá. Možnost D má obdobný problém na začátku jako možnost C, dále pak kontroluje délku front jen u platby u klasické pokladny a u samoobslužné ji nezohledňuje."
      },
  ];


    return <div className="slide">
    <div className='slide-h1-wrapper'><h1>Závěrečné shrnutí</h1></div>
    <div className="slide-content-wrapper ">

    <div className='bpmn-diagram-wrapper'>
        <div
        ref={containerSupermarketObjRef}
        className='bpmn-diagram-supermarketver2'
        />
    </div>

       
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