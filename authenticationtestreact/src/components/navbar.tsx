import { NavLink } from "react-router";
import "./styles/navbar.css";

function Navbar() {
  return (
    <>
      <nav className="navMenu">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/about">About</NavLink>
        <div className="dot"></div>
      </nav>
    </>
  );
}

export default Navbar;
