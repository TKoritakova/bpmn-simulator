import { useState, useEffect } from 'react';


export default function Chap2Slide1({ setSlideFinished }) {


  const steps = [
    { text: 'Vstup do supermarketu', 
      description: 'Zákazník vstupuje do obchodu a bere si nákupní košík či vozík.', 
      type: 'Spouštěcí událost',
      source: '-' },
    { text: 'Výběr zboží', 
      description: 'Zákazník se prochází po obchodu a vybírá z regálů zboží, které chce koupit.', 
      type: 'Aktivita',
      source: 'Zákazník' },
    { text: 'Platba za nákup', 
      description: 'Zákazník vyskládá zboží na pás. Pokladník skenuje produkty. Zákazník následně za nákup zaplatí kartou či hotově.', 
      type: 'Aktivita',
    
      source: 'Zákazník, prodavač',},
    { text: 'Odchod s nákupem', 
      description: 'Zákazník si zabalí svůj nákup do tašek a odchází z obchodu.', 
      type: 'Koncová událost',
      source: '-',
    }
  ];

  const [openTooltips, setOpenTooltips] = useState(Array(steps.length).fill(false));
  const [visitedTooltips, setVisitedTooltips] = useState(Array(steps.length).fill(false));

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
      [1]: all
    }));
  
  }, [visitedTooltips]);
    

    return <div className="slide">
        <div className='slide-h1-wrapper'><h1>Co je to modelování?</h1></div>
        <div className='slide-content-wrapper'>
          <p>Modelování je <b>tvorba zjednodušeného obrazu reality</b>, který pomáhá lépe porozumět složitým systémům. Převádí se při něm popis procesu do modelu podle předem <b>vydefinovaných vlastností daného procesu</b>. Mezi ty patří pojmy vysvětlené v předchozí kapitole - <b>aktivity, události a jejich propojení mezi sebou</b>, dále to, jaké máme <b>vstupy a výstupy aktivit</b> a jejich formu a jaké máme <b>zdroje pro proces</b> (lidé, technologie a další).</p>

          <h2>Model</h2>
          <p>Model jako takový je <b>abstrakce a zjednodušení problému s reálným základem</b>. Modelem je možné snížit složitost problému tím, že z něj <b>vybereme jen ty části reality, které s ním souvisí</b>. Měl by mít svůj <b>předmět, cílovou skupinu a konkrétní účel</b>, pro který je tvořen. Nelze přímo definovat jak vytvořit jeden nejlepší model, vždy musí být tvořen v závislosti na situaci. Máme různé druhy modelů, například:</p>

          <ul>
            <li><b>Fyzické modely</b> - pod fyzickým modelem je možné si představit například prototypy výrobků.</li>
            <li><b>Matematické modely</b> - pod matematické modely spadají například rovnice popisující ekonomické vztahy.</li>
            <li><b>Procesní modely</b> - procesní modely jsou vizualizací pracovních postupů dané organizace a slouží k jejich analýze, optimalizaci a zlepšení efektivity.</li>
          </ul>

          <p>Jednoduchým modelem může být příklad uvedený na začátku první lekce. Nyní ho <b>rozšíříme o popis vlastností:</b></p>

          <div className="easy-process">
        {steps.map((step, index) => (
          <div
            key={index}
            className="step-container"
            onClick={() => toggleTooltip(index)}
            
          >
            <div className="step-heading"><p className="step">{step.text}</p></div>
            {openTooltips[index] && (
              <div className="tooltip">
                <p><i>Popis:</i></p>
                <p>{step.description}</p>
                <p><br /><i>Jaká část procesu?</i></p>
                <p>{step.type}</p>
                <p><br /><i>Zdroj(e)</i></p>
                <p>{step.source}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="action-label"><i>(Kliknutím na jednotlivé položky v modelu zobrazíte podrobnosti.)</i></p>

      <p className="explanation">Pamatujete si na problémy, na které v jednotlivých krocích může zákazník narazit? Pokud ne, můžete si je připomenout na začátku předchozí lekce, jelikož budou v této lekci potřebné.</p>


    </div>   </div>
    ;
}