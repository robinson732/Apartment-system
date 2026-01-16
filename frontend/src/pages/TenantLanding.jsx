import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/TenantLanding.css";

export default function TenantLanding() {
  const navigate = useNavigate();
  const tenantName = localStorage.getItem("userName");

  useEffect(() => {
    if (!tenantName) {
      navigate("/login");
    }
  }, [navigate, tenantName]);

  return (
    <div className="tenant-landing">
      {/* WELCOME HERO SECTION */}
      <section className="welcome-hero">
        <div className="hero-background">
          <div className="gradient-blob blob-1"></div>
          <div className="gradient-blob blob-2"></div>
        </div>

        <div className="welcome-content">
          <h1 className="welcome-title">
            Welcome, <span className="tenant-name">{tenantName}!</span>
          </h1>
          <p className="welcome-subtitle">
            Let's find the perfect room for you
          </p>
        </div>
      </section>

      {/* QUICK STATS SECTION */}
      <section className="quick-stats">
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon">🔍</div>
            <div className="stat-info">
              <h3>Available Rooms</h3>
              <p className="stat-number">200+</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-info">
              <h3>Verified Landlords</h3>
              <p className="stat-number">50+</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>Happy Tenants</h3>
              <p className="stat-number">5000+</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💳</div>
            <div className="stat-info">
              <h3>Easy Payments</h3>
              <p className="stat-number">100% Secure</p>
            </div>
          </div>
        </div>
      </section>

      {/* ROOM SELECTION CTA SECTION */}
      <section className="room-selection-cta">
        <div className="cta-container">
          <h2>Your Room Type: <span className="selected-room">{localStorage.getItem("selectedRoomType") || "Not Selected"}</span></h2>
          <p>You've selected your preferred room type. Now explore available properties and start your journey!</p>

          <div className="cta-actions">
            <button 
              className="primary-btn"
              onClick={() => navigate("/tenant")}
            >
              Browse Available Rooms →
            </button>
            <button 
              className="secondary-btn"
              onClick={() => navigate("/room-selection")}
            >
              Change Room Type
            </button>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section className="why-choose">
        <div className="why-container">
          <h2>Why Choose Our Platform?</h2>

          <div className="benefits-grid">
            <div className="benefit-item">
              <div className="benefit-icon">🔒</div>
              <h3>Secure & Safe</h3>
              <p>All transactions and personal data are encrypted and protected</p>
            </div>

            <div className="benefit-item">
              <div className="benefit-icon">⚡</div>
              <h3>Quick Process</h3>
              <p>Find and book your room in just a few simple steps</p>
            </div>

            <div className="benefit-item">
              <div className="benefit-icon">💬</div>
              <h3>Direct Communication</h3>
              <p>Chat directly with landlords to clarify any details</p>
            </div>

            <div className="benefit-item">
              <div className="benefit-icon">📱</div>
              <h3>Mobile Friendly</h3>
              <p>Access your account anytime, anywhere on any device</p>
            </div>

            <div className="benefit-item">
              <div className="benefit-icon">💰</div>
              <h3>Flexible Payments</h3>
              <p>Multiple payment options with secure checkout</p>
            </div>

            <div className="benefit-item">
              <div className="benefit-icon">🤝</div>
              <h3>Verified Landlords</h3>
              <p>All landlords are verified to ensure quality and reliability</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BUTTON SECTION */}
      <section className="final-cta">
        <div className="final-cta-content">
          <h2>Ready to Find Your Perfect Room?</h2>
          <p>Browse through our extensive collection and find your ideal accommodation</p>
          <button 
            className="cta-button"
            onClick={() => navigate("/room-selection")}
          >
            Continue to Room Selection →
          </button>
        </div>
      </section>
    </div>
  );
}
