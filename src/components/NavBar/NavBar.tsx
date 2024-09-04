// src/Navbar.js
import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import "./NavBar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isSampleEditPage = location.pathname.startsWith("/sampleEdit/");

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        {!isSampleEditPage ? (
          <NavLink to="/" className="nav-link">
            MyLogo
          </NavLink>
        ) : (
          <Button variant="text" color="primary" onClick={() => navigate(-1)}>
            Back
          </Button>
        )}
      </div>
      <ul className="navbar-links">
        <li>
          <NavLink to="/about" className="nav-link">
            About
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
