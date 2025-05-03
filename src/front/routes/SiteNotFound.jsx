import { Link } from 'react-router-dom';

export default function SiteNotFound() {
    return <div className="home">
      <h1>Stránka nenalezena nebo není zatím dostupná.</h1>
      
    
      <Link to="/bpmn-simulator">Domů</Link>
      </div>
    ;
  }