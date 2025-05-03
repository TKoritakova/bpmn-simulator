import { useState, useEffect } from "react";


const LOCAL_KEY_STATE = "chapter1-test-state";
const LOCAL_KEY_SUBMITTED = "chapter1-test-submitted";

export default function Chap1Slide6({ setSlideFinished }) {

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
          [6]: true
        }));
    };

  const questions = [
    {
      id: 1,
      question: "Co je to proces?",
      options: {
        a: "Jednorázová činnost, kterou provádí zaměstnanec",
        b: "Sada propojených aktivit vedoucích k výstupu",
        c: "Seznam úkolů, které je třeba splnit",
        d: "Aktivity a události, které je spouští",
      },
      correct: "b",
      explanation: "Na začátku této lekce je řečeno, že proces je sada propojených aktivit, událostí a rozhodnutí, které přeměňují vstupy na výstupy za účelem dosažení konkrétního cíle. Nejedná se tak o jednorázovou činnost ani seznam úkolů ke splnění, stejně jako nejde jen o aktivity a události, ty musí být navzájem propojení."
    },
    {
        id: 2,
        question: "Jaký zdroj/zdroje je potřeba pro proces výroby auta?",
        options: {
          a: "Papírové formuláře",
          b: "Obchodní zástupce společnosti",
          c: "Stroje a suroviny",
          d: "Dodavatel materiálů",
        },
        correct: "c",
        explanation: "Zdroje procesu označují kohokoliv nebo cokoliv, co je v procesu nutné k provádění aktivit. Proces výroby nepotřebuje nutně žádné papírové formuláře ani obchodního zástupce společnosti, který se účastní procesu prodeje auta, nikoliv přímo jeho výroby. Dodavatel materiálů se výroby jako takové též neúčastní, proces, jehož je zdrojem, může být například proces naskladnění materiálů."
      },
      {
        id: 3,
        question: "Co je nejvhodnější KPI pro proces expedice objednávek eshopu?",
        options: {
          a: "Průměrný čas doručení objednávek",
          b: "Počet použitých barev obalových materiálů",
          c: "Maximální velikost objednávky",
          d: "Celkové náklady na nákup doručovacích vozidel"
        },
        correct: "a",
        explanation: "KPI je konkrétní a měřitelná hodnota, kterou se hodnotí efektivita a výkonnost procesu. Do této definice spadá průměrný čas doručení objednávek. Naopak barvy použitých obalových materiálu nám o efektivitě a výkonnosti nic neřeknou. Maximální velikost objednávky sice do definice KPI spadá, ale je spíše statistickým údajem a rozhodně má menší význman než průměrný čas. Náklady na nákup doručovacích vozidel do tohoto procesu nespadají, vozidla se budou nakupovat v jiném, odděleném procesu - zde by mělo význam jen sledování nákladů na jejich provoz, například spotřeba a cena paliva."
      },
      {
        id: 4,
        question: "Co platí o kvantitativních metrikách?",
        options: {
          a: "Vyhodnocují efektivitu procesu na základě osobních zkušeností zaměstnanců",
          b: "Neobsahují žádné výpočty, protože jsou čistě subjektivní",
          c: "Jsou založeny především na sledování času a nákladů a poskytují systematický pohled na proces",
          d: "Sledují hlavně názory a spokojenost zákazníků procesu"
        },
        correct: "c",
        explanation: "Kvantitativní metriky jsou založeny na sledování konkrétních veličin jako je čas nebo náklady. Nejedná se tedy o subjektivní hodnocení, osobní zkušenosti nebo názory."


      },
      {
        id: 5,
        question: "Společnost poskytující služby překladů textů chce zlepšit svůj proces pro objednávky od zákazníků. Vedení společnosti se rozhodně zaměřit na dobu trvání procesu, dostupnosti a vytížení překladatelů, délky textů k překladu podle počtu slov a celkové tržby za měsíc. Který z následujících výroků není v souladu s principy procesního řízení?",
        options: {
          a: "Doba trvání procesu je kvantitativní metrika a může nám sloužit jako podklad pro tvorbu KPI.",
          b: "Celkové tržby za měsíc mohou být KGI - hodnotit, zda byl splněn strategický cíl v podobě překročení řečené hranice chtěných tržeb.",
          c: "Délka textů k překladu je údaj, který ovlivňuje dobu trvání procesu, a tedy je vhodné ho sledovat jako metriku.",
          d: "Vytížení překladatelů nelze pomocí metrik sledovat, jelikož neexistuje způsob, jak určit přesný pohyb zdrojů v procesu a jejich konkrétní využití k plnění aktivit.",
        },
        correct: "d",
        explanation: "Vytížení zdrojů pracujících na procesu naopak je jednou z častých metrik, které je možné sledovat a které jsou zajímavé pro optimalizaci procesů. Na základě těchto pozorování je možné přerozdělit práci více efektivně nebo najmout další zaměstance, čímž je možné snížit i čekací časy, zkrátit procesní fronty a tím pádem vylepšit celkové časy trvání procesu. Ostatní možnosti uvádí správné odpovědi."
      },
  ];


    return <div className="slide">
    <div className='slide-h1-wrapper'><h1>Závěrečné shrnutí</h1></div>
    <div className="slide-content-wrapper slide-content-wrapper-question">

       
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
        <p><i>Test byl odeslán. Výsledky jsou uloženy.</i></p>
      )}

        </div>
    </div>   
    ;
}