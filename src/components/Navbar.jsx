// src/components/Navbar.jsx
import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <nav style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
      <Link to="bpmn-simulator/">Domů</Link> |{' '}
      <Link to="bpmn-simulator/lesson-1">Lekce 1</Link> |{' '}

    </nav>
  );
}
