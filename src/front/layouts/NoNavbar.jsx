import { Outlet } from "react-router-dom";

/**
 * React component displaying layout without navigation panel. 
 * @component
 * @returns {JSX.Element} React element displaying layout without navigation panel
 */
export default function NoNavbar() {
  return <Outlet />;
}