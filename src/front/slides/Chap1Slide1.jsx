import { useState, useEffect } from 'react';


export default function Chap1Slide1({ setSlideFinished }) {



    const steps = [
        { text: 'Vstup do supermarketu', description: 'Zákazník vstupuje do obchodu a bere si nákupní košík či vozík.', problem: 'Obchod je přeplněný, takže nejsou dostupné košíky.' },
        { text: 'Výběr zboží', description: 'Zákazník se prochází po obchodu a vybírá z regálů zboží, které chce koupit.', problem: 'Zboží, které chce, je vyprodané.' },
        { text: 'Platba za nákup', description: 'Zákazník vyskládá zboží na pás. Pokladník skenuje produkty. Zákazník následně za nákup zaplatí kartou či hotově.', problem: 'U poklady je dlouhá fronta, pokladník špatně naskenuje zboží, nejsou dostupné tašky.' },
        { text: 'Odchod s nákupem', description: 'Zákazník si zabalí svůj nákup do tašek a odchází z obchodu.', problem: 'Reklamace špatně naskenovaného či poškozeného zboží.' },
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
        <div className='slide-h1-wrapper'><h1>Co je to proces?</h1></div>
        <div className='slide-content-wrapper'>

{/* Lit. 4, str 30 */}
<p>Proces je možné chápat jako to, co společnosti dělají, když poskytují službu nebo produkt zákazníkům. Způsob, jakým je proces navržen a prováděn, ovlivňuje kvalitu služby nebo produktu a též efektivitu, s jakou jsou služby nebo produkty vytvářeny.</p>

<p>Více formálně se dá říct, že proces:</p>

<ul>
        <li>je <b>sada propojených aktivit, událostí a rozhodnutí</b>, které <b>přeměňují vstupy na výstupy</b> za účelem dosažení <b>konkrétního cíle</b>.
            <ul>
                <li><b>aktivity</b> - vždy jeden úkon, který je třeba v procesu provést</li>
                <li><b>události</b> - věci, které se dějí automaticky a nemají žádnou dobu trvání, ale spouští aktivity</li>
                <li><b>rozhodnutí</b> - místo, kde je třeba určit jakým způsobem se bude proces dále provádět</li>
            </ul>
        </li>
        <li>má jasně <b>definovaný svůj začátek a konec</b>.</li>
        <li>musí mít svého <b>zákazníka</b>, kterým může i být sama společnost, a musí pro něj mít hodnotu.</li>
    </ul>
<h2>Příklad jednoduchého procesu: Nákup v supermarketu</h2>
<p className="explanation">Níže je umístěn příklad jednoduchého procesu, který je každý schopný si představit. Jedná se o velmi zjednodušenou verzi toho, co se při nákupu z pohledu nakupujícího děje. Každá krok má popsané, co se v něm děje, a zároveň připojených pár problémů, kterým může v daném kroku čelit. Napadají vás nějaké další?</p>

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
                <p><i>Co se zde děje?</i></p>
                <p>{step.description}</p>
                <p><br /><i>Možné problémy v tomto bodě:</i></p>
                <p>{step.problem}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="action-label"><i>(Kliknutím na jednotlivé položky v příkladu procesu zobrazíte jejich podrobnosti.)</i></p>

    </div>   </div>
    ;
}