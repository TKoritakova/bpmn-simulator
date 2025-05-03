import { Link } from 'react-router-dom';

export default function Home() {
    return <div className="home">
      <h1>Výukový simulátor procesního řízení</h1>
      
  
{/* Literatura 5, str. 17, též Literatura 4, strana 29*/}
<p>Každá organizace, nehledě na sektor svého působení, musí řídit své činnosti, které zahrnují <b>aktivity</b>, které její zaměstnanci provádí, <b>události</b>, kterým čelí, a <b>rozhodnutí</b>, která je nutná dělat. Pokud se tyto činnosti spojí do řady po sobě jdoucích úkonů k vykonání, která se ve společnosti opakovaně provádí, dostaneme strukturu, které se říká <b>proces</b>. Procesů je v každé organizaci několik - ať už je to vyřizování objednávek zákazníků, nábor zaměstance nebo samotná výroba produktu.</p>

  <p><b>Procesní řízení</b> je způsob, jakým společnost může přistupovat ke svým činnostem. Umožňuje systematicky a efektivně <b>zachycovat, navrhovat, provádět, dokumentovat, měřit, monitorovat a řídit</b> jak automatizované, tak neautomatizované procesy. Skrze něj lze procesy sladit s obchodní strategií, a tím zlepšit celkový výkon společnosti optimalizací procesů. Vylepšení procesů může zahrnovat snížení nákladů, prováděcích časů a procenta jejich neúspěšného dokončení. 
 </p>

 {/* Díky tomuto systematickému a promyšlenému přístupu k řízení procesů mohou firmy dosahovat lepších výsledků rychleji a flexibilněji. */}

 <p>Cílem této aplikace je naučit porozumění základům procesního řízení, seznámit s nástroji pro popis procesů skrze notační jazyk BPMN a vyzkoušet měření a optimalizaci procesů v interaktivní simulaci.</p>
      
      <Link to="lesson-1">Přejít k výuce &gt;&gt;</Link>
      </div>
    ;
  }