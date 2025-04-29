// src/components/Navbar.jsx
import { Link } from 'react-router-dom';

export function Navbar() {
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
      <Link to="bpmn-simulator/lesson-2"><div className='circle'>2</div></Link> 
      <Link to="bpmn-simulator/lesson-3"><div className='circle'>3</div></Link> 
      <Link to="bpmn-simulator/lesson-4"><div className='circle'>4</div></Link> 


    </nav>
  );
}
