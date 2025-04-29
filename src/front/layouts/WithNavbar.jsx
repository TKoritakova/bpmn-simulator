import { Outlet } from "react-router-dom";
import { Navbar } from '../components/NavBar';

export default function WithNavbar() {
  return (
    <>
      <Navbar />
      <Outlet /> 
    </>
  );
}