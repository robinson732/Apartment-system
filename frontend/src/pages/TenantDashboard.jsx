import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/TenantDashboard.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Rent prices by house type
const RENT_TABLE = {
  "Bedsitter": 5000,
  "1-Bedroom": 8000,
  "2-Bedroom": 12000,
};

const UTILITY_BILLS = {
  water: 800,
  electricity: 1200,
};

export default function TenantDashboard() {
  const navigate = useNavigate();
  const tenantName = localStorage.getItem("userName");
  const selectedHouseType = localStorage.getItem("selectedHouseType");

  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentProcessing, setPaymentProcessing] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(null);

  useEffect(() => {
    if (!tenantName || !selectedHouseType) {
      navigate("/tenants");
      return;
    }

    loadTenantData();
  }, [tenantName, selectedHouseType, navigate]);

  const loadTenantData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/tenants`);
      const data = await res.json();

      const me = data.find(
        (t) => t.name?.toLowerCase() === tenantName?.toLowerCase()
      );

      if (me) {
        setTenant({
          ...me,
          houseType: selectedHouseType,
        });
      }
    } catch (error) {
      console.error("Error loading tenant data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (type, amount) => {
    setPaymentProcessing(type);
    try {
      const response = await fetch(`${API}/api/tenants/pay/${tenant.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, amount }),
      });

      if (response.ok) {
        setPaymentSuccess(type);
        // Update local state
        const updated = { ...tenant };
        if (type === "rent") updated.rent_paid = true;
        if (type === "water") updated.water_bill_paid = true;
        if (type === "electricity") updated.electricity_bill_paid = true;
        setTenant(updated);

        setTimeout(() => setPaymentSuccess(null), 3000);
      }
    } catch (err) {
      console.error("Payment failed:", err);
    } finally {
      setPaymentProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="dashboard-error">
        <div className="error-icon">❌</div>
        <h2>Dashboard Not Available</h2>
        <p>Please select a house type first.</p>
        <button onClick={() => navigate("/tenants")}>Go Back</button>
      </div>
    );
  }

  const rentAmount = RENT_TABLE[selectedHouseType] || "N/A";

  return (
    <div className="tenant-dashboard">
      {/* HEADER SECTION */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-greeting">
            <h1>Welcome Back, {tenant.name}! 👋</h1>
            <p className="header-subtitle">Here's your rental status overview</p>
          </div>
          <div className="header-identity">
            <div className="identity-badge">
              <div className="badge-icon">🏠</div>
              <div className="badge-info">
                <span className="badge-label">Your House Type</span>
                <span className="badge-value">{selectedHouseType}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* SUCCESS NOTIFICATION */}
      {paymentSuccess && (
        <div className="payment-notification success">
          <span className="notification-icon">✓</span>
          <span>Payment successful! Thank you.</span>
        </div>
      )}

      {/* PAYMENT CARDS SECTION */}
      <section className="payments-section">
        <h2 className="section-title">💰 Payments Due</h2>
        <div className="payment-cards-grid">
          {/* RENT CARD */}
          <div
            className={`payment-card rent-card ${
              tenant.rent_paid ? "paid" : "unpaid"
            }`}
          >
            <div className="card-header">
              <h3>Monthly Rent</h3>
              <span className={`status-badge ${tenant.rent_paid ? "paid" : ""}`}>
                {tenant.rent_paid ? "✓ Paid" : "Pending"}
              </span>
            </div>

            <div className="card-amount">
              <span className="currency">Ksh</span>
              <span className="amount">{rentAmount.toLocaleString()}</span>
            </div>

            <p className="card-description">
              {tenant.rent_paid
                ? "Your rent is paid for this month. Thank you!"
                : "Your rent payment is due. Pay now to avoid late fees."}
            </p>

            {!tenant.rent_paid && (
              <button
                className="payment-btn primary"
                onClick={() => handlePayment("rent", rentAmount)}
                disabled={paymentProcessing === "rent"}
              >
                {paymentProcessing === "rent" ? (
                  <>
                    <span className="spinner-small"></span>Processing...
                  </>
                ) : (
                  <>💳 Pay Rent Now</>
                )}
              </button>
            )}

            {tenant.rent_paid && (
              <button className="payment-btn success-btn" disabled>
                ✓ Payment Completed
              </button>
            )}
          </div>

          {/* WATER BILL CARD */}
          <div
            className={`payment-card water-card ${
              tenant.water_bill_paid ? "paid" : "unpaid"
            }`}
          >
            <div className="card-header">
              <h3>Water Bill</h3>
              <span className={`status-badge ${tenant.water_bill_paid ? "paid" : ""}`}>
                {tenant.water_bill_paid ? "✓ Paid" : "Pending"}
              </span>
            </div>

            <div className="card-amount">
              <span className="currency">Ksh</span>
              <span className="amount">{UTILITY_BILLS.water}</span>
            </div>

            <p className="card-description">
              {tenant.water_bill_paid
                ? "Your water bill has been paid."
                : "Monthly water usage charges."}
            </p>

            {!tenant.water_bill_paid && (
              <button
                className="payment-btn secondary"
                onClick={() => handlePayment("water", UTILITY_BILLS.water)}
                disabled={paymentProcessing === "water"}
              >
                {paymentProcessing === "water" ? (
                  <>
                    <span className="spinner-small"></span>Processing...
                  </>
                ) : (
                  <>💧 Pay Water</>
                )}
              </button>
            )}

            {tenant.water_bill_paid && (
              <button className="payment-btn success-btn" disabled>
                ✓ Payment Completed
              </button>
            )}
          </div>

          {/* ELECTRICITY BILL CARD */}
          <div
            className={`payment-card electricity-card ${
              tenant.electricity_bill_paid ? "paid" : "unpaid"
            }`}
          >
            <div className="card-header">
              <h3>Electricity Bill</h3>
              <span
                className={`status-badge ${
                  tenant.electricity_bill_paid ? "paid" : ""
                }`}
              >
                {tenant.electricity_bill_paid ? "✓ Paid" : "Pending"}
              </span>
            </div>

            <div className="card-amount">
              <span className="currency">Ksh</span>
              <span className="amount">{UTILITY_BILLS.electricity}</span>
            </div>

            <p className="card-description">
              {tenant.electricity_bill_paid
                ? "Your electricity bill has been paid."
                : "Monthly electricity consumption charges."}
            </p>

            {!tenant.electricity_bill_paid && (
              <button
                className="payment-btn tertiary"
                onClick={() =>
                  handlePayment("electricity", UTILITY_BILLS.electricity)
                }
                disabled={paymentProcessing === "electricity"}
              >
                {paymentProcessing === "electricity" ? (
                  <>
                    <span className="spinner-small"></span>Processing...
                  </>
                ) : (
                  <>⚡ Pay Electricity</>
                )}
              </button>
            )}

            {tenant.electricity_bill_paid && (
              <button className="payment-btn success-btn" disabled>
                ✓ Payment Completed
              </button>
            )}
          </div>
        </div>
      </section>

      {/* SUMMARY SECTION */}
      <section className="summary-section">
        <h2 className="section-title">📊 Payment Summary</h2>
        <div className="summary-grid">
          <div className="summary-item">
            <div className="summary-circle rent">
              <span>🏠</span>
            </div>
            <h4>Total Rent</h4>
            <p className="summary-value">Ksh {rentAmount.toLocaleString()}</p>
            <p className="summary-status">
              {tenant.rent_paid ? "✓ Paid" : "Due"}
            </p>
          </div>

          <div className="summary-item">
            <div className="summary-circle water">
              <span>💧</span>
            </div>
            <h4>Water</h4>
            <p className="summary-value">Ksh {UTILITY_BILLS.water}</p>
            <p className="summary-status">
              {tenant.water_bill_paid ? "✓ Paid" : "Due"}
            </p>
          </div>

          <div className="summary-item">
            <div className="summary-circle electricity">
              <span>⚡</span>
            </div>
            <h4>Electricity</h4>
            <p className="summary-value">Ksh {UTILITY_BILLS.electricity}</p>
            <p className="summary-status">
              {tenant.electricity_bill_paid ? "✓ Paid" : "Due"}
            </p>
          </div>

          <div className="summary-item">
            <div className="summary-circle total">
              <span>💰</span>
            </div>
            <h4>Total Due</h4>
            <p className="summary-value">
              Ksh{" "}
              {(
                rentAmount +
                (tenant.rent_paid ? 0 : 0) +
                UTILITY_BILLS.water +
                UTILITY_BILLS.electricity
              ).toLocaleString()}
            </p>
            <p className="summary-status">
              {tenant.rent_paid &&
              tenant.water_bill_paid &&
              tenant.electricity_bill_paid
                ? "✓ All Paid"
                : "Pending"}
            </p>
          </div>
        </div>
      </section>

      {/* ACTION FOOTER */}
      <footer className="dashboard-footer">
        <button
          className="footer-btn secondary"
          onClick={() => navigate("/tenants")}
        >
          ← Change House Type
        </button>
      </footer>
    </div>
  );
}
