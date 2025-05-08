import { useState, useEffect } from 'react';


export default function Chap3Slide2({ setSlideFinished }) {



  useEffect(() => {       
    setSlideFinished(prev => ({
            ...prev,
            [2]: true
          }));         
  }, []);
    

    return <div className="slide">
      <div className='slide-h1-wrapper'><h1>Simulační scénář</h1></div>
      <div className='slide-content-wrapper'>
        {/* lit 4. - str. 303 */}

        <p>Každá simulace potřebuje kromě modelu, který bude simulovat, i svá vstupní data. Těm se říká říká simulační scénář a ten může obsahovat tato data:</p>

                
        <div className='simulation-scenario-description'>
            
            <div className='simulation-scenario-description-item'>
              <h2>Specifikace scénáře</h2>
              <p><b>Příchody instancí</b> - údaj, který říká, v jakých intervalech přichází nové instance procesu. Například víme, že do prodejny supermarketu přichází průměrně patnáct zákazníků za hodinu, takže simulaci nastavíme, aby během hodiny simulačního času vytvořila patnáct nových instancí. Příchody se často nastavují podle pravděpodobnostního rozdělení doplněného o časovou jednotku. V této aplikaci se používají tři:</p>
                <ul>
                  <li>Fixní - pevná hodnota příchodů za časovou jednotku.</li>
                  <li>Normální - příchody se řídí normálním rozdělením. Do scenáře se zadává časová jednotka, průměrná hodnota toho, jak jsou od sebe dva příchody vzdáleny, a možná odchylka.</li>
                  <li>Exponenciální - příchody se řídí exponenciálním rozdělením. Do scenáře se zadává časová jednotka průměrná hodnota času mezi dvěma příchody.</li>
                </ul>
              <p><b>Počet instancí</b> - určuje, kolik instancí se celkem v rámci simulace spustí. Některé nástroje mohou k počtu instancí též chtít procento, kolik jich na začátku a konci vyloučit, jelikož tato data mohou být zkreslená rozjezdem a dojezdem procesu (například mají jiné časy čekání ve frontě).</p>
              <p><b>Začátek simualce</b> - konkrétní datum a čas, od kterého se simulace spustí. Má význam pro pracovní doby zdrojů, viz dále.</p>
              <p><b>Měna simulace</b> - měna, ve které se simulace odehrává, slouží ke spočítání nákladů.</p>
            </div>


            <div className='simulation-scenario-description-item'>
              <h2>Zdroje</h2>
              <p>Zdroje jsou lidé či role, kteří na projektu pracují. Mohou být shodné s bazény a dráhami v modelu. Každému zdroji se nastaví jeho jméno, počet toho, kolik jich je dostupných, mzda za časový údaj a pracovní doba.</p>           
            </div>

            <div className='simulation-scenario-description-item'>
              <h2>Pracovní doby</h2>
              <p>Pracovní doby určují časy, v nichž zdroje pracují. Pracovních dob můžeme vytvořit několik a každé se nastavuje jméno, první den práce v týdnu, poslední den práce v týdnu a dva časy, v nichž každý zdroj ten den pracuje.</p>           
            </div>

            <div className='simulation-scenario-description-item'>
              <h2>Aktivity</h2>
              <p>Všem aktivitám, které se v procesu nachází, je třeba nastavit jejich pravděpodobné doby trvání. Ty se opět řídí pravděpodobnostními rozděleními a v případě této aplikace se opět bude jednat jen o fixní, normální a exponenciální. Kromě času trvání je třeba aktivitám přiřadit zdroj, který na nich pracuje, a případné fixní náklady nad rámec platu zdroje, které se k aktivitě vážou.</p>           
            </div>
            
            <div className='simulation-scenario-description-item'>
              <h2>Brány</h2>
              <p>Všem branám, které proces obsahuje, se musí přiřadit pravděpodobnosti k větvím, které z nich vychází. Jejich součet musí dát dohromady číslo jedna a určují, s jakou pravděpodobností se určitá větev vykoná. Některé simulační nástroje navíc umožňují pro každou větev nastavit několik hodnot - pro první, druhý, třetí, ... průchod branou.</p>           
            </div>
            

            <div className='simulation-scenario-description-item'>
              <h2>Události</h2>
              <p>Některým událostem, které to potřebují, je též třeba nastavit dobu trvání - například časovačům.</p>           
            </div>
        </div>

        <p>Po vyplnění všech hodnot lze kompletní simulační scénář spustit. Též se k němu jde vrátit a měnit různé hodnoty, například počty dostupných zdrojů nebo pracovní doby, a zkoumat, jak to ovlivňuje statistiky.</p>

    </div>


       
    </div>
    ;
}