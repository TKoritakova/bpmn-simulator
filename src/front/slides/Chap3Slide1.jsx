import { useState, useEffect } from 'react';


export default function Chap3Slide1({ setSlideFinished }) {



  useEffect(() => {       
    setSlideFinished(prev => ({
            ...prev,
            [1]: true
          }));         
  }, []);
    

    return <div className="slide">
      <div className='slide-h1-wrapper'><h1>Co je to simulace procesů?</h1></div>
      <div className='slide-content-wrapper'>
        {/* lit 4. - str. 303 */}

        <p>Simulace procesů je velmi oblíbená technika pro kvantitativní analýzu procesních modelů. Umožňuje virtuálně napodobit chování reálných procesů a jejich průběh za různých podmínek. Jejím výstupem je simulační log, ale také statistické údaje o trvání procesu, průměrných čekacích časech a průměrném využití zdrojů. Využívá se tedy k:</p>

        <ul>
          <li>Testování a optimalizaci procesů bez rizika zásahu do reality.</li>
          <li>Predikce možných problémů a úzkých míst procesu.</li>
          <li>Zlepšení efektivity a snížení nákladů.</li>
        </ul>

        <p>Společnosti tak mohou simulace využívat pro zlepšení svých procesů tím, že testují různé simulační scénáře a zkoumají jejich výsledky.</p>

        <p>Simulace po spuštění vytváří instance procesu. Každá instance se rovná jednomu provedení daného procesu. Postupně plní aktivity v jednotlivých instancích a svůj postup ukládá.</p>

        <p>
</p>

          


      </div>   
    </div>
    ;
}