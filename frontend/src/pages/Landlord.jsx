import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Landlord.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const RENT_TABLE = {
  "Bedsitter": 5000,
  "1-Bedroom": 8000,
  "2-Bedroom": 12000,
  "Studio": 6000,
  "3-Bedroom": 15000,
};

const UTILITY_BILLS = {
  water: 800,
  electricity: 1200,
};

export default function LandlordDashboard() {
  const navigate = useNavigate();
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [removingTenant, setRemovingTenant] = useState(null);
  const [removeConfirm, setRemoveConfirm] = useState(null);

  useEffect(() => {
    fetchTenants();
    fetchPaymentHistory();
    
    // Auto-refresh every 3 seconds to show real-time updates
    const interval = setInterval(() => {
      fetchTenants();
      fetchPaymentHistory();
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchTenants = async () => {
    try {
      const res = await fetch(`${API}/api/tenants`);
      const data = await res.json();

      const transformedTenants = data.map(tenant => {
        const rentAmount = RENT_TABLE[tenant.room_type] || 0;
        let balance = 0;

        if (!tenant.rent_paid) balance += rentAmount;
        if (!tenant.water_bill_paid) balance += UTILITY_BILLS.water;
        if (!tenant.electricity_bill_paid) balance += UTILITY_BILLS.electricity;

        return {
          id: tenant.id,
          name: tenant.name,
          email: tenant.email,
          room_type: tenant.room_type || "Not Selected",
          rent: rentAmount,
          rent_paid: tenant.rent_paid,
          water_paid: tenant.water_bill_paid,
          electricity_paid: tenant.electricity_bill_paid,
          balance: balance,
          total_due: rentAmount + UTILITY_BILLS.water + UTILITY_BILLS.electricity,
        };
      });

      setTenants(transformedTenants);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching tenants:", err);
      setError("Failed to fetch tenants");
      setLoading(false);
    }
  };

  const fetchPaymentHistory = async () => {
    try {
      const res = await fetch(`${API}/api/payments`);
      const data = await res.json();
      setPaymentHistory(data || []);
    } catch (err) {
      console.error("Error fetching payment history:", err);
    }
  };

  const handleRemoveTenant = async (tenantId, tenantName) => {
    if (removeConfirm !== tenantId) {
      setRemoveConfirm(tenantId);
      return;
    }

    setRemovingTenant(tenantId);
    try {
      const res = await fetch(`${API}/api/tenants/${tenantId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setTenants(tenants.filter(t => t.id !== tenantId));
        setRemoveConfirm(null);
      } else {
        alert("Failed to remove tenant");
      }
    } catch (err) {
      console.error("Error removing tenant:", err);
      alert("Error removing tenant");
    } finally {
      setRemovingTenant(null);
    }
  };

  const calculateTotalCollected = () => {
    return tenants.reduce((sum, tenant) => {
      let collected = 0;
      if (tenant.rent_paid) collected += tenant.rent;
      if (tenant.water_paid) collected += UTILITY_BILLS.water;
      if (tenant.electricity_paid) collected += UTILITY_BILLS.electricity;
      return sum + collected;
    }, 0);
  };

  const calculateTotalOutstanding = () => {
    return tenants.reduce((sum, tenant) => sum + tenant.balance, 0);
  };

  const calculateTotalPossible = () => {
    return tenants.reduce((sum, tenant) => sum + tenant.total_due, 0);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="landlord-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="landlord-dashboard">
      {/* Sidebar */}
      <aside className="landlord-sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-logo">🏠 LANDLORD</h2>
        </div>
        <ul className="sidebar-menu">
          <li
            className={activeMenu === "dashboard" ? "active" : ""}
            onClick={() => setActiveMenu("dashboard")}
          >
            <span className="menu-icon">📊</span>
            Dashboard
          </li>
          <li
            className={activeMenu === "tenants" ? "active" : ""}
            onClick={() => setActiveMenu("tenants")}
          >
            <span className="menu-icon">👥</span>
            Tenants
          </li>
          <li
            className={activeMenu === "payments" ? "active" : ""}
            onClick={() => setActiveMenu("payments")}
          >
            <span className="menu-icon">💰</span>
            Payments
          </li>
        </ul>
        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="landlord-main">
        <header className="landlord-header">
          <div>
            <h1>Landlord Management Portal</h1>
            <p>Manage tenants and track payments</p>
          </div>
          <button 
            className="refresh-btn"
            onClick={() => {
              fetchTenants();
              fetchPaymentHistory();
            }}
            title="Refresh data"
          >
            🔄 Refresh
          </button>
        </header>

        {error && <div className="error-alert">{error}</div>}

        {/* DASHBOARD VIEW */}
        {activeMenu === "dashboard" && (
          <div className="dashboard-view">
            {/* Summary Cards */}
            <section className="summary-cards">
              <div className="summary-card total">
                <div className="card-icon">👥</div>
                <div className="card-content">
                  <h3>Active Tenants</h3>
                  <p className="card-value">{tenants.length}</p>
                </div>
              </div>

              <div className="summary-card collected">
                <div className="card-icon">✓</div>
                <div className="card-content">
                  <h3>Amount Collected</h3>
                  <p className="card-value">Ksh {calculateTotalCollected().toLocaleString()}</p>
                </div>
              </div>

              <div className="summary-card outstanding">
                <div className="card-icon">⏳</div>
                <div className="card-content">
                  <h3>Outstanding Balance</h3>
                  <p className="card-value">Ksh {calculateTotalOutstanding().toLocaleString()}</p>
                </div>
              </div>

              <div className="summary-card possible">
                <div className="card-icon">🎯</div>
                <div className="card-content">
                  <h3>Total Possible Revenue</h3>
                  <p className="card-value">Ksh {calculateTotalPossible().toLocaleString()}</p>
                </div>
              </div>
            </section>

            {/* Collection Stats */}
            <section className="stats-section">
              <h2>Collection Overview</h2>
              <div className="stats-grid">
                <div className="stat-box">
                  <span className="stat-label">Collection Rate</span>
                  <span className="stat-value">
                    {calculateTotalPossible() > 0
                      ? Math.round((calculateTotalCollected() / calculateTotalPossible()) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="stat-box">
                  <span className="stat-label">Paid Tenants</span>
                  <span className="stat-value">
                    {tenants.filter(t => t.balance === 0).length}/{tenants.length}
                  </span>
                </div>
                <div className="stat-box">
                  <span className="stat-label">Avg Balance/Tenant</span>
                  <span className="stat-value">
                    Ksh {tenants.length > 0 ? Math.round(calculateTotalOutstanding() / tenants.length) : 0}
                  </span>
                </div>
              </div>
            </section>

            {/* Quick Payment Status */}
            <section className="quick-status-section">
              <h2>Quick Payment Status</h2>
              <div className="status-table">
                <table>
                  <thead>
                    <tr>
                      <th>Tenant Name</th>
                      <th>Room Type</th>
                      <th>Amount Due</th>
                      <th>Balance</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tenants.slice(0, 5).map((tenant) => (
                      <tr key={tenant.id} className={tenant.balance === 0 ? "paid-row" : "pending-row"}>
                        <td className="tenant-name">{tenant.name}</td>
                        <td>{tenant.room_type}</td>
                        <td>Ksh {tenant.total_due.toLocaleString()}</td>
                        <td className="balance-cell">
                          {tenant.balance > 0 ? (
                            <span className="balance-amount">Ksh {tenant.balance.toLocaleString()}</span>
                          ) : (
                            <span className="balance-paid">✓ Paid</span>
                          )}
                        </td>
                        <td>
                          <span className={`status-badge ${tenant.balance === 0 ? "paid" : "pending"}`}>
                            {tenant.balance === 0 ? "Paid" : "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* TENANTS VIEW */}
        {activeMenu === "tenants" && (
          <div className="tenants-view">
            <h2>Manage Tenants</h2>
            <div className="tenants-list">
              {tenants.length === 0 ? (
                <div className="empty-state">
                  <p>No tenants yet</p>
                </div>
              ) : (
                <div className="tenants-table-scroll">
                  <table className="tenants-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Room Type</th>
                        <th>Rent</th>
                        <th>Total Due</th>
                        <th>Balance</th>
                        <th>Rent Status</th>
                        <th>Water</th>
                        <th>Electricity</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tenants.map((tenant) => (
                        <tr key={tenant.id}>
                          <td className="bold">{tenant.name}</td>
                          <td>{tenant.email}</td>
                          <td>{tenant.room_type}</td>
                          <td>Ksh {tenant.rent.toLocaleString()}</td>
                          <td>Ksh {tenant.total_due.toLocaleString()}</td>
                          <td className={tenant.balance > 0 ? "balance-due" : "balance-paid"}>
                            {tenant.balance > 0 ? `Ksh ${tenant.balance.toLocaleString()}` : "✓"}
                          </td>
                          <td>
                            <span className={`payment-badge ${tenant.rent_paid ? "paid" : "pending"}`}>
                              {tenant.rent_paid ? "✓ Paid" : "Pending"}
                            </span>
                          </td>
                          <td>
                            <span className={`payment-badge ${tenant.water_paid ? "paid" : "pending"}`}>
                              {tenant.water_paid ? "✓" : "✗"}
                            </span>
                          </td>
                          <td>
                            <span className={`payment-badge ${tenant.electricity_paid ? "paid" : "pending"}`}>
                              {tenant.electricity_paid ? "✓" : "✗"}
                            </span>
                          </td>
                          <td>
                            <button
                              className={`remove-btn ${removeConfirm === tenant.id ? "confirm" : ""}`}
                              onClick={() => handleRemoveTenant(tenant.id, tenant.name)}
                              disabled={removingTenant === tenant.id}
                            >
                              {removeConfirm === tenant.id
                                ? "Confirm?"
                                : "Remove"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PAYMENTS VIEW */}
        {activeMenu === "payments" && (
          <div className="payments-view">
            <h2>Payment Tracking</h2>
            
            {/* Detailed Payment Status */}
            <section className="payment-status-section">
              <div className="payment-status-cards">
                <div className="status-card full-paid">
                  <h3>Fully Paid</h3>
                  <p className="count">{tenants.filter(t => t.balance === 0).length}</p>
                  <p className="revenue">Ksh {calculateTotalCollected().toLocaleString()}</p>
                </div>
                <div className="status-card partial-paid">
                  <h3>Partial/Unpaid</h3>
                  <p className="count">{tenants.filter(t => t.balance > 0).length}</p>
                  <p className="balance">Ksh {calculateTotalOutstanding().toLocaleString()}</p>
                </div>
              </div>
            </section>

            {/* Detailed Payment Table */}
            <div className="payment-details">
              <table className="payment-table">
                <thead>
                  <tr>
                    <th>Tenant</th>
                    <th>Room</th>
                    <th>Rent</th>
                    <th>Water</th>
                    <th>Electricity</th>
                    <th>Total Due</th>
                    <th>Outstanding Balance</th>
                    <th>Payment %</th>
                  </tr>
                </thead>
                <tbody>
                  {tenants.map((tenant) => {
                    const paymentPercent = tenant.total_due > 0 
                      ? Math.round(((tenant.total_due - tenant.balance) / tenant.total_due) * 100)
                      : 0;

                    return (
                      <tr key={tenant.id} className={tenant.balance === 0 ? "fully-paid" : ""}>
                        <td className="tenant-cell">{tenant.name}</td>
                        <td>{tenant.room_type}</td>
                        <td>
                          <span className={`amount ${tenant.rent_paid ? "paid" : "pending"}`}>
                            {tenant.rent_paid ? "✓" : ""}
                            {" "}Ksh {tenant.rent.toLocaleString()}
                          </span>
                        </td>
                        <td>
                          <span className={`amount ${tenant.water_paid ? "paid" : "pending"}`}>
                            {tenant.water_paid ? "✓" : ""}
                            {" "}Ksh {UTILITY_BILLS.water}
                          </span>
                        </td>
                        <td>
                          <span className={`amount ${tenant.electricity_paid ? "paid" : "pending"}`}>
                            {tenant.electricity_paid ? "✓" : ""}
                            {" "}Ksh {UTILITY_BILLS.electricity}
                          </span>
                        </td>
                        <td className="bold">Ksh {tenant.total_due.toLocaleString()}</td>
                        <td className={tenant.balance > 0 ? "balance-amount" : "balance-zero"}>
                          {tenant.balance > 0 ? `Ksh ${tenant.balance.toLocaleString()}` : "✓ Cleared"}
                        </td>
                        <td>
                          <div className="progress-bar">
                            <div
                              className="progress-fill"
                              style={{
                                width: `${paymentPercent}%`,
                                background:
                                  paymentPercent === 100
                                    ? "#27ae60"
                                    : paymentPercent >= 50
                                    ? "#f39c12"
                                    : "#e74c3c",
                              }}
                            ></div>
                            <span className="progress-text">{paymentPercent}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
