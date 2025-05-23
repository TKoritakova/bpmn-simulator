import { Link } from 'react-router-dom';



const LOCAL_KEY_CHAP1_SUBMITTED = "chapter1-test-submitted";
const LOCAL_KEY_CHAP2_SUBMITTED = "chapter2-test-submitted";
const LOCAL_KEY_CHAP3_SUBMITTED = "chapter3-test-submitted";

/**
 * React component displaying homepage. 
 * @component
 * @returns {JSX.Element} React element displaying homepage
 */
export default function Home() {

    const link = () => {
      const submitted1 = localStorage.getItem(LOCAL_KEY_CHAP1_SUBMITTED);
      const submitted2 = localStorage.getItem(LOCAL_KEY_CHAP2_SUBMITTED);
      const submitted3 = localStorage.getItem(LOCAL_KEY_CHAP3_SUBMITTED);
      

      if (submitted3) {
        return "lesson-4";
      } else if (submitted2) {
        return "lesson-3"
      } else if (submitted1) {
        return "lesson-2"
      } else {
        return "lesson-1"
      }

    }


    return <div className="home">
      <h1>Výukový simulátor procesního řízení</h1>
      
  
{/* Literatura 5, str. 17, též Literatura 4, strana 29*/}
<p>Každá organizace, nehledě na sektor svého působení, musí řídit své činnosti, které zahrnují <b>aktivity</b>, které její zaměstnanci provádí, <b>události</b>, kterým čelí, a <b>rozhodnutí</b>, která je nutná dělat. Pokud se tyto činnosti spojí do řady po sobě jdoucích úkonů k vykonání, která se ve společnosti opakovaně provádí, dostaneme strukturu, které se říká <b>proces</b>. Procesů je v každé organizaci několik - ať už je to vyřizování objednávek zákazníků, nábor zaměstance nebo samotná výroba produktu.</p>

  <p><b>Procesní řízení</b> je způsob, jakým společnost může přistupovat ke svým činnostem. Umožňuje systematicky a efektivně <b>zachycovat, navrhovat, provádět, dokumentovat, měřit, monitorovat a řídit</b> jak automatizované, tak neautomatizované procesy. Skrze něj lze procesy sladit s obchodní strategií, a tím zlepšit celkový výkon společnosti optimalizací procesů. Vylepšení procesů může zahrnovat snížení nákladů, prováděcích časů a procenta jejich neúspěšného dokončení. 
 </p>

 {/* Díky tomuto systematickému a promyšlenému přístupu k řízení procesů mohou firmy dosahovat lepších výsledků rychleji a flexibilněji. */}

 <p>Cílem této aplikace je naučit porozumění základům procesního řízení, seznámit s nástroji pro popis procesů skrze notační jazyk BPMN a vyzkoušet měření a optimalizaci procesů v interaktivní simulaci. Obsahuje tři lekce s interaktivními úkoly a závěrečným testem a následný závěrečný úkol vycházející z předchozích lekcí.</p>
      
      <Link to={link()}>Přejít k výuce &gt;&gt;</Link>


<p>Aplikace pokrývá pouze základy všech probíraných témat a nemá sloužit jako kompletní přehled teorie. Pro zájemce je možné se o jednotlivých tématech dovzdělat v těchto publikacích:</p>

<ul>
  <li>Hajo A. Reijers Marlon Dumas Marcello La Rosa, Jan Mendling, <b>Fundamentals of Business Process Management</b>, Springer-Verlag Berlin and Heidelberg GmbH & Co. KG, 2019, <i>ISBN 36-625-8585-5.</i></li>
<li>Jakob Freund, Bernd Rücker, <b>Real-Life BPMN (4th edition): Includes an introduction to DMN</b>, Independently published, 2019, <i>ISBN 10-863-0209-5</i>.</li>
</ul>

      </div>
    ;
  }