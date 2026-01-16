import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("userName");
  const [isOpen, setIsOpen] = useState(false);

  const logout = () => {
    localStorage.clear();
    setIsOpen(false);
    navigate("/");
  };

  const isHome = location.pathname === "/";

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🏘️</span>
          <span className="brand-text">RoomFinder</span>
        </Link>

        <div className={`navbar-menu ${isOpen ? "active" : ""}`}>
          {role && (
            <div className="navbar-user">
              <span className="user-avatar">👤</span>
              <span className="user-name">{name || "User"}</span>
            </div>
          )}

          {role && (
            <button className="logout-btn" onClick={logout}>
              <span>Logout</span>
            </button>
          )}

          {!role && !isHome && (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/signup" className="nav-link cta-link">
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button 
          className={`hamburger ${isOpen ? "active" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}
