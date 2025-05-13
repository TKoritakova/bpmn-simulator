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

        <p>Každá simulace potřebuje kromě modelu, který bude simulovat, i svá vstupní data, která ji ovlivňují. Těm se říká simulační scénář a ten může obsahovat tato data:</p>

                
        <div className='simulation-scenario-description'>
            
            <div className='simulation-scenario-description-item'>
              <h2>Specifikace scénáře</h2>
              <p><b>Intervaly spouštění instancí</b> - údaj, který říká, v jakých intervalech se spouští nové instance procesu. Například víme, že do prodejny supermarketu přichází průměrně patnáct zákazníků za hodinu, takže simulaci nastavíme, aby během hodiny simulačního času vytvořila patnáct nových instancí. Příchody se často nastavují podle pravděpodobnostního rozdělení doplněného o časovou jednotku. V této aplikaci se používají tři:</p>
                <ul>
                  <li><b>Fixní</b> - pevná hodnota nových instancí za časovou jednotku. Znamená to tedy, že instance vždy začne po pevně stanoveném čase. Například jednou za dva dny vždy přijde nové zboží do skladu.</li>
                  <li><b>Normální</b> - vytváření nových instancí se řídí normálním rozdělením, které má tvar gaussovy křivky. Ta nám říká, že zhruba 68 % instancí začne v intervalu, který je ohraničen dvěma body, které vzniknou odečtením a přičtením standardní odchylky k průměrné hodnotě. Zbytek instancí se vytvoří dříve nebo později, ale čím dále je hodnota od průměrné, tím menší pravděpodobnost je, že se v ní nová instance vytvoří. Do scénáře se poté tedy zadává časová jednotka, průměrná hodnota toho, jak jsou od sebe dva příchody vzdáleny, a možná odchylka. Příkladem tohoto rozdělení může být, že víme, že jeden zákazník chodí průměrně jednou za šest minut. Pokud je odchylka dvě minuty, znamená to, že 68 % zákazníků, kteří po sobě přichází, přijde po čtyřech až osmi minutách po předchozím zákazníkovi.</li>
                  <li><b>Exponenciální</b> - vytváření nových instancí se řídí exponenciálním rozdělením. Toto rozdělení může být reprezentováno křivkou, která začíná nejvyššími hodnotami, jde strmě dolů a postupně se její strmost zmenšuje. Proto je větší pravděpodobnost, že nová instance bude vytvořena spíše dříve než později - čím déle se čeká, tím menší pravděpodobnost výskytu je. Do scenáře se zadává časová jednotka průměrná hodnota frekvence příchodů - například dvě instance za minutu. To znamená, že většina nových instancí se vyskytne do 30 sekund od té předchozí. Může se však stát, že to bude až po minutě a půl, ovšem je to málo pravděpodobné. Naopak případ do deseti sekund je velmi pravděpodobný.</li>
                </ul>
              <p><b>Počet instancí</b> - určuje, kolik instancí se celkem v rámci simulace spustí. Některé nástroje mohou k počtu instancí též chtít procento, kolik jich na začátku a konci vyloučit, jelikož tato data mohou být zkreslená rozjezdem a dojezdem procesu (například mají jiné časy čekání ve frontě).</p>
              <p><b>Začátek simulace</b> - <b>konkrétní datum a čas</b>, od kterého se simulace spustí. Má význam pro pracovní doby zdrojů, viz dále.</p>
              <p><b>Měna simulace</b> - měna, ve které se simulace odehrává, slouží ke spočítání nákladů.</p>
            </div>


            <div className='simulation-scenario-description-item'>
              <h2>Zdroje</h2>
              <p>Zdroje jsou lidé či role, kteří na procesu pracují - tedy jsou to účastníci procesu. Taktéž to mohou být systémy, tedy jakékoliv aktivní zdroje definované při tvorbě procesu. Mohou být shodné s bazény a drahami v modelu. Každému zdroji se nastaví jeho <b>jméno</b>, <b>kapacita</b> (tedy například kolik prodavačů je k dispozici), <b>mzda</b> za časový údaj a <b>pracovní doba</b>.</p>           
            </div>

            <div className='simulation-scenario-description-item'>
              <h2>Pracovní doby</h2>
              <p>Pracovní doby určují časy, v nichž zdroje pracují. Pracovních dob můžeme vytvořit několik a každé se nastavuje <b>jméno</b>, <b>první den práce v týdnu</b>, <b>poslední den práce v týdnu</b> a <b>dva časy</b>, mezi nimiž každý zdroj v jednom dni pracuje.</p>           
            </div>

            <div className='simulation-scenario-description-item'>
              <h2>Aktivity</h2>
              <p>Všem aktivitám, které se v procesu nachází, je třeba nastavit jejich <b>doby trvání</b>. Ty se opět řídí <b>pravděpodobnostními rozděleními</b> a v případě této aplikace se opět bude jednat jen o <b>fixní, normální a exponenciální</b>. Kromě času trvání je třeba aktivitám přiřadit <b>zdroj</b>, který na nich pracuje, a případné <b>fixní náklady nad rámec platu zdroje</b>, které se k aktivitě vážou.</p>           
            </div>
            
            <div className='simulation-scenario-description-item'>
              <h2>Větvení</h2>
              <p>Všem větvením, které proces obsahuje, se musí přiřadit <b>pravděpodobnosti</b> k větvím, které z nich vychází. Jejich součet musí dát dohromady číslo jedna a určují, <b>s jakou pravděpodobností se určitá větev vykoná</b>. Pro případ, že se v procesu prochází daným větvením vícekrát a je třeba rozlišit s jakou pravděpodobností se větve vykonají, umožňují některé simulační nástroje navíc pro každou větev nastavit několik hodnot - pro první, druhý, třetí, ... průchod větvením.</p>           
            </div>
            

            <div className='simulation-scenario-description-item'>
              <h2>Události</h2>
              <p>Některým událostem, které to vyžadují, je též třeba nastavit <b>dobu trvání</b> - například časovačům.</p>           
            </div>
        </div>

        <p>Po vyplnění všech hodnot lze kompletní simulační scénář spustit. Též se k němu lze vrátit a měnit různé hodnoty, například počty dostupných zdrojů nebo pracovní doby, a zkoumat, jak to ovlivňuje statistiky.</p>

    </div>


       
    </div>
    ;
}