import { Link } from 'react-router-dom';

/**
 * React component displaying site not found warning. 
 * @component
 * @returns {JSX.Element} React element displaying site not found warning
 */
export default function SiteNotFound() {
    return <div className="home">
      <h1>Stránka nenalezena.</h1>
      
    
      <Link to="/bpmn-simulator">Domů</Link>
      </div>
    ;
  }