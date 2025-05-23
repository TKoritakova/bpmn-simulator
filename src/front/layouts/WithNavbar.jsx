import { Outlet } from "react-router-dom";
import { Navbar } from '../components/NavBar';

/**
 * React component displaying layout with navigation panel. 
 * @component
 * @returns {JSX.Element} React element displaying layout with navigation panel
 */
export default function WithNavbar() {
  return (
    <>
      <Navbar />
      <Outlet /> 
    </>
  );
}