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

        <p>Výklad výsledků simulace pro dělání závěrů nebo podkladů pro rozhodování není vždy úplně jednoduchý. Simulace pracují se zjednodušeným idealizovaným modelem světa a nemusí pokrýt všechny detaily skutečného procesu. Pokud navíc jen malé změny v simulačních scénářích dělají velké změny ve výsledcích simulací, je třeba být při výkladu skutečně opatrný. Přesto data ze simulace mohou být užitečná. Může se jednat o:</p>

        <ul>
          <li>Obecné informace, které dávají údaje o celém běhu simulace. Například to může být celkový čas běhu, celkové náklady nebo celkové čekací časy.</li>
          <li>Údaje o jednotlivých instancích, které mohou například zahrnovat minima, maxima a průměry trvání instance procesu, čekacích časů nebo nákladů, ale též histogramy (= grafy rozložení výsledků) těchto údajů.</li>
          <li>Údaje o jednotlivých aktivitách, například průměrné doby trvání napříč instancemi, minima, maxima a další.</li>
          <li>Heatmapy, které graficky znázorňují, ve kterých místech může mít graf svá slabá místa.</li>
        </ul>
        

          


      </div>   
    </div>
    ;
}