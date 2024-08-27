// src/Navbar.js
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import "./NavBar.css"; // We'll create this file in the next step
import SampleEdit from "../pages/SampleEdit";

const Navbar = () => {
  //TODO: Add an upload button
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <NavLink to="/" className="nav-link">
          MyLogo
        </NavLink>
      </div>
      <ul className="navbar-links">
        <li>
          <NavLink to="/sampleEdit" className="nav-link">
            Sample Edit
          </NavLink>
        </li>

        <li>
          <NavLink to="/about" className="nav-link">
            About
          </NavLink>
        </li>

        <button className="back-button ml-4" onClick={() => navigate(-1)}>
          Back
        </button>
        {/*location.pathname === "/" && <NavLink to="/" />*/}
      </ul>
    </nav>
  );
};

export default Navbar;
