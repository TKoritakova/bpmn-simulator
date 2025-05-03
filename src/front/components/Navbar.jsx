// src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';


const LOCAL_KEY_CHAP1_SUBMITTED = "chapter1-test-submitted";

export function Navbar() {
  const [submitted, setSubmitted] = useState(false);

  const checkStorage = () => {
    const stored = localStorage.getItem(LOCAL_KEY_CHAP1_SUBMITTED);
    setSubmitted(!!stored);
  };

  useEffect(() => {
    checkStorage();

    const handler = () => checkStorage();
    window.addEventListener("storageUpdated", handler);

    return () => window.removeEventListener("storageUpdated", handler);
  }, []);


  return (
    <nav className='sidenav'>
      <Link to="bpmn-simulator/"><div className='circle'><svg width="30" height="35">

<line x1="5" y1="30" x2="25" y2="30" stroke="black" strokeWidth="3" strokeLinecap="round"/>

<line x1="5" y1="13" x2="5" y2="30" stroke="black" strokeWidth="3" strokeLinecap="round"/>
<line x1="25" y1="13" x2="25" y2="30" stroke="black" strokeWidth="3" strokeLinecap="round"/>

<line x1="5" y1="13" x2="15" y2="3" stroke="black" strokeWidth="3" strokeLinecap="round"/>
<line x1="15" y1="3" x2="25" y2="13" stroke="black" strokeWidth="3" strokeLinecap="round"/>

</svg></div></Link>
      <Link to="bpmn-simulator/lesson-1"><div className='circle'>1</div></Link> 

      {submitted
        ? <Link to="bpmn-simulator/lesson-2"><div className='circle'>2</div></Link>
        : <div className='circle-disabled'>2</div>}


      <Link to="bpmn-simulator/lesson-3"><div className='circle'>3</div></Link> 
      <Link to="bpmn-simulator/lesson-4"><div className='circle'>4</div></Link> 


    </nav>
  );
}
