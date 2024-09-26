import React from "react";
import "./NavBar.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import Header from "./Logout";

function NavBar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [token]);

  return (
    <div className="navbar-container">
      <nav className="navbar">
        <ul className="navbar-list">
          <li className="navbar-item">
            <Link to="/login" className="navbar-link">
              Login
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/signup" className="navbar-link">
              Sign Up
            </Link>
          </li>
          <li className="navbar-item">
            <Link
              to={isAuthenticated ? "/profile" : "/error"}
              className="navbar-link"
            >
              Profile
            </Link>
          </li>
          {isAuthenticated && <Header />}
        </ul>
      </nav>
    </div>
  );
}
export default NavBar;
