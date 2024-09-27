import React from "react";
import "./NavBar.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import Logout from "./Logout";
// import Logout from "./Logout";
import UseToken from "../services/UseToken";

function NavBar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { token, removeToken, setToken } = UseToken();

  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
      console.log("isAuthenticated", isAuthenticated);
    } else {
      setIsAuthenticated(false);
      console.log("isAuthenticated", isAuthenticated);
    }
    console.log("token", token);
  }, [token]);

  // const handleClick = () => {
  //   if (token) {
  //     setIsAuthenticated(true);
  //   } else {
  //     setIsAuthenticated(false);
  //   }
  // };

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
          {isAuthenticated && <Logout removeToken={removeToken} />}
        </ul>
      </nav>
    </div>
  );
}
export default NavBar;
