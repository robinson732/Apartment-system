
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Landing.css";
import image from "../assets/images.jpeg";
import Footer from "./Footer"; 

export default function Landing() {
  const navigate = useNavigate();

  const handleSignup = (role) => {
    sessionStorage.setItem("signupRole", role);
    navigate("/signup");
  };

  return (
    <div className="landing-container">
      <div className="hero-section">
        <img
          src={image}
          alt="Apartment Management System"
          className="hero-image"
        />
        <div className="hero-overlay"></div>
        
        <div className="hero-content">
          <h1 className="main-title">Smart Property Management</h1>
          <p className="subtitle">Streamline your rental business with our all-in-one solution</p>
          <p className="description">Manage tenants, track payments, and communicate effortlessly</p>
          
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">🏠</div>
              <h3>Property Management</h3>
              <p>Organize and manage multiple properties</p>
            </div>
            <div className="feature">
              <div className="feature-icon">👥</div>
              <h3>Tenant Tracking</h3>
              <p>Keep detailed records of all tenants</p>
            </div>
            <div className="feature">
              <div className="feature-icon">💰</div>
              <h3>Payment Tracking</h3>
              <p>Monitor rent and bills effortlessly</p>
            </div>
            <div className="feature">
              <div className="feature-icon">💬</div>
              <h3>Communication</h3>
              <p>Direct messaging with tenants</p>
            </div>
          </div>

          <div className="cta-section">
            <p className="cta-text">Get started today. Choose your role:</p>
            <div className="buttons">
              <button className="btn btn-landlord" onClick={() => handleSignup("landlord")}>
                <span className="btn-icon">🏢</span>
                Landlord
              </button>
              <button className="btn btn-tenant" onClick={() => handleSignup("tenant")}>
                <span className="btn-icon">🏠</span>
                Tenant
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
