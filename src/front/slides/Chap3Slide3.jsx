import { useState, useEffect } from 'react';


export default function Chap3Slide3({ setSlideFinished }) {



  useEffect(() => {       
    setSlideFinished(prev => ({
            ...prev,
            [3]: true
          }));         
  }, []);
    

    return <div className="slide">
      <div className='slide-h1-wrapper'><h1>Interpretace výsledků simulace</h1></div>
      <div className='slide-content-wrapper'>
        {/* lit 4. - str. 311 */}

        <p>Výklad výsledků simulace pro dělání závěrů nebo podkladů pro rozhodování není vždy úplně jednoduchý. Simulace pracují se zjednodušeným idealizovaným modelem světa a nemusí pokrýt všechny detaily skutečného procesu. V některých případech mohou malé změny v simulačních scénářích způsobit velké změny ve statistikách, což je jedna ze situací, kdy je třeba při interpretaci být skutečně opatrný. Přesto data ze simulace mohou být užitečná. Může se jednat o:</p>

        <ul>
          <li><b>Obecné informace</b>, které dávají údaje o celém běhu simulace. Například to může být celkový čas běhu, celkové náklady nebo celkové čekací časy.</li>
          <li><b>Údaje o jednotlivých instancích</b>, které mohou například zahrnovat minima, maxima a průměry trvání instance procesu, čekacích časů nebo nákladů, ale též histogramy (= grafy rozložení výsledků) těchto údajů.</li>
          <li><b>Údaje o jednotlivých aktivitách</b>, například průměrné doby trvání napříč instancemi, minima, maxima a další.</li>
          <li><b>Heatmapy</b>, které graficky znázorňují, ve kterých místech může mít graf svá slabá místa.</li>
        </ul>
        
        <p className='explanation'>Při interpretaci těchto dat musí být jasné, co je cílem analýzy - například chce společnost zjistit, které aktivity trvají nejdéle? Které aktivity nejdéle čekají na zdroje? Nebo které aktivity jsou nejdražší? Teprve když je jasné, co se v datech hledá, je možné to hledat.</p>
        

      </div>   
    </div>
    ;
}