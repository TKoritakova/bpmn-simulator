import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';


const LOCAL_KEY_CHAP1_SUBMITTED = "chapter1-test-submitted";
const LOCAL_KEY_CHAP2_SUBMITTED = "chapter2-test-submitted";
const LOCAL_KEY_CHAP3_SUBMITTED = "chapter3-test-submitted";

/**
 * React component displaying navigation panel. 
 * @component
 * @returns {JSX.Element} React element displaying navigation panel
 */
export function Navbar() {
  const [submitted1, setSubmitted1] = useState(false);
  const [submitted2, setSubmitted2] = useState(false);
  const [submitted3, setSubmitted3] = useState(false);

  const checkStorage = () => {
    const stored1 = localStorage.getItem(LOCAL_KEY_CHAP1_SUBMITTED);
    setSubmitted1(!!stored1);
    const stored2 = localStorage.getItem(LOCAL_KEY_CHAP2_SUBMITTED);
    setSubmitted2(!!stored2);
    const stored3 = localStorage.getItem(LOCAL_KEY_CHAP3_SUBMITTED);
    setSubmitted3(!!stored3);
  };

  useEffect(() => {
    checkStorage();

    const handler = () => checkStorage();
    window.addEventListener("storageUpdated", handler);

    return () => window.removeEventListener("storageUpdated", handler);
  }, []);


  return (
    <nav className='sidenav'>
      <Link to="bpmn-simulator/">
        <div className='circle'>
          <svg width="30" height="35">
            <line x1="5" y1="30" x2="25" y2="30" stroke="black" strokeWidth="3" strokeLinecap="round"/>
            <line x1="5" y1="13" x2="5" y2="30" stroke="black" strokeWidth="3" strokeLinecap="round"/>
            <line x1="25" y1="13" x2="25" y2="30" stroke="black" strokeWidth="3" strokeLinecap="round"/>
            <line x1="5" y1="13" x2="15" y2="3" stroke="black" strokeWidth="3" strokeLinecap="round"/>
            <line x1="15" y1="3" x2="25" y2="13" stroke="black" strokeWidth="3" strokeLinecap="round"/>
          </svg>
        </div>
      </Link>
      <Link to="bpmn-simulator/lesson-1"><div className='circle'>1</div></Link> 
      {submitted1
        ? <Link to="bpmn-simulator/lesson-2"><div className='circle'>2</div></Link> 
        : <div className='circle-disabled'>2</div>}
      {submitted2
        ? <Link to="bpmn-simulator/lesson-3"><div className='circle'>3</div></Link>
        : <div className='circle-disabled'>3</div>}
      {submitted3
        ? <Link to="bpmn-simulator/lesson-4"><div className='circle'>4</div></Link>
        : <div className='circle-disabled'>4</div>}
    </nav>
  );
}
