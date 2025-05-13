import { useState } from "react";

export default function Chap1Slide5({ setSlideFinished }) {

    const metricsOptions = [
        {text: "Počet zpracovaných faktur za kvartál", correct: false, reason: "Nesouvisí s procesem nákupu, jedná se o administrativní údaj."},
        {text: "Očekávaný čas čekání ve frontě u pokladny", correct: true, reason: "Jedná se o analýzu fronty, která má vliv jak na trvání procesu, tak též na spokojenost zákazníka."},
        {text: "Průměrné náklady vynaložené na jeden nákup", correct: true, reason: "Jedná se o metriku vycházející z analýzy procesního toku, určuje jaké náklady má supermarket na jeden zákaznický nákup."},
        {text: "Průměrné manko v pokladně", correct: false, reason: "Spíše než procesní metrika je tento údaj jeden z klíčových ukazatelů (KPI), který říká, jakou chybovost má pokladník při zpracování platby."},
        {text: "Počet proškolených zaměstnanců na práci s pokladnou", correct: false, reason: "Tento údaj je zajímavý pro proces náboru zaměstnanců či jiný obdobný, ale na proces nákupu nemá žádný vliv."},
        {text: "Průměrný čas trvání nákupu", correct: true, reason: "Jedná se o základní časovou metriku procesu, která se dá určit z analýzy procesního toku."}
    ]
    

    const [clickedOptions, setClickedOptions] = useState({});
    const [OptionExplanation, setOptionExplanation] = useState(null);


    const handleClick = (index, isCorrect, reason) => {   
        
        clickedOptions[index] = isCorrect;
        setOptionExplanation(reason);
        

        if (Object.values(clickedOptions).filter(value => value === true).length >= 3) {
            setSlideFinished(prev => ({
                ...prev,
                [5]: true
              }));
          
        }    
      
    };

    const renderOptions = (options, clickedState) =>
        options.map((opt, index) => {
            const clicked = clickedState[index];
            let style = {};
            if (clicked !== null && clicked !== undefined) {
                style = {
                    backgroundColor: clicked ? "#3ac961" : "#de4545",
                    border: "2px solid",
                    borderColor: clicked ? "#30a64f" : "#a63030",
                    
                };
            }

            return (
                <div key={index} onClick={() => handleClick(index, opt.correct, opt.reason)}>
                    <p style={style}>{opt.text}</p>                   
                </div>
            );
        });


    return <div className="slide">
    <div className='slide-h1-wrapper'><h1>Metriky procesů</h1></div>
    <div className="slide-content-wrapper">
<p>Procesní metriky lze dále rozdělit na <b>kvantitativní</b> a <b>kvalitativní</b>.</p>

<div className="metrics-wrapper">
{/* lit. 4 - str. 279 */}
<div className="metrics">
    <h2>Kvantitativní metriky</h2> 
    <div className="metrics-content">
    <p>Tato skupina metrik je založena zejména na <b>sledování veličiny času a v menší míře též nákladů</b>. Poskytuje <b>systematický vhled do procesu</b>, ovšem její výsledky někdy nemusí být dostatečně detailní nebo nezkreslené pro použití při rozhodování. Jejich zlepšení lze docílit <b>optimalizací procesů</b>.</p>

    <p>První skupinou metrik, která sem spadá, jsou metriky vycházející z <b>analýzy procesního toku (flow analysis)</b>. Tyto metriky se zaměřují na odhadování celkové výkonnosti procesu na základě určitých znalostí o průběhu jeho jednotlivých aktivit, událostí a rozhodnutí. Zařadit sem můžeme například:</p>
    <ul>
        <li><b>Průměrný čas běhu procesu</b> - celkový čas běhu procesu je čas získaný součtem trvání jednotlivých aktivit, ale též času, kdy se na jejich provedení čeká, například z důvodu nedostupných zdrojů. Dá se určit z modelu procesu a časových údajů přiřazených k jednotlivým aktivitám dosazením do rovnic pro tyto výpočty. Ty zde nebudou dále rozebírány.</li>
        <li><b>Účinnost procesu</b> - metrika, která říká, jaké procento z celkového času běhu procesu je skutečně vynaloženo na plnění činností. Dá se zjistit vydělením času, kdy skutečně probíhají aktivity a vytváří se výstupy, výskedkem předchozí metriky.</li>
        <li><b>Průměrné náklady</b> - pokud jsou známy náklady na provedení jednotlivých aktivit a počty toho, kolikrát bude aktivita v rámci procesu provedena, dají se výpočtem určit průměrné náklady na jedno provedení procesu. Tento výpočet je podobný výpočtu průměrného času běhu procesu.</li>
    </ul>

    <p>Druhá skupina metrik jsou metriky založené na <b>analýze fronty (queuing analysis)</b>. Fronty vznikají kvůli vytížení zdrojů i jejich propojení napříč procesem, takže ne všechny aktivity je možné provést hned v okamžiku, kdy skončí jejich předchůdce. Díky těmto metrikám můžeme spočítat <b>očekávanou délku fronty</b> nebo <b>očekávaný průměrný čas čekání každé aktivity</b>.</p>

    <p>Třetí skupinou jsou <b>simulace</b>, které jsou hlavní náplní této aplikace a budou více rozebrány dále.</p>
</div></div> 

{/* lit 4 - str 237 */}
<div className="metrics">
    <h2>Kvalitativní metriky</h2>  
    <div className="metrics-content">
    <p>Kvalitativní analýza procesu je složitější na provedení, jelikož neexistuje žádný jeden správný způsob, jak dojít k dobrým výsledkům. Existují však techniky, které k nim obvykle vedou. Zlepšení výsledků těchto metrik lze docílit přepracováním procesů. Mezi tyto techniky patří:</p>

    <ul>
        <li>Analýza přidané hodnoty (value-added analysis) - tato analýza dělí aktivity do tří skupin: aktivity s přidanou hodnotou, které jsou potřebné pro zákazníka, aktivity s přidanou obchodní hodnotou, které jsou potřebné pro organizaci, a aktivity bez přidané hodnoty, které zahrnují vše, co nespadá do předchozích dvou kategorií. Po rozdělení aktivit je možné určit poměry kategorií vůči sobě a zhodnotit přínosy procesu.</li>
        <li>Analýza odpadu (waste analysis) - tato analýza má za cíl určit a zredukovat aktivity, které nemají pro proces hodnotu. Existuje sedm zdrojů tohoto odpadu, například zbytečná transportace materiálů nebo dokumentů po organizaci, čas čekání u jednotlivých aktivit na doplnění materiálu, vstupu nebo uvolnění zdroje, nadměrné zpracování, tedy provádění úkolů, které nejsou nutné, nebo nadměrná produkce, která vytváří nepotřebné instance procesu.</li>
        <li>Analýza stakeholderů (stakeholder analysis)</li>
        <li>Analýza registru problémů (issue register analysis)</li>
    </ul>

    <p>S kvalitativními metrikami tato aplikace dále nepracuje.</p>
</div></div>
</div>

<h2>Příklad: Kvantitativní metriky procesu nákupu v supermarketu</h2>
<p className="explanation">Ve cvičení je nutné vybrat všechny kvantitativní metriky, které je vhodné v procesu nákupu sledovat. Co by měl supermarket měřit, aby zjistil, kde mohou být slabá místa, a mohl zlepšit své služby pro zákazníka? A co by měl sledovat pro své vlastní potřeby, aby mohl zlepšit své hospodaření?</p>
    <div className="options-section-wrapper">
        <div className="options-wrapper">
            <p><i>Označte metriky vhodné pro proces nákupu v supermarketu:</i></p>
            <div className="options">
                {renderOptions(metricsOptions, clickedOptions, "input")}
            </div>
            {OptionExplanation && (<p className="option-explanation">{OptionExplanation}</p>)}
        </div>         
    </div>

        </div>
    </div>   
    ;
}