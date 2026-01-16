import React, { useEffect, useState } from "react";
import "../styles/Tenants.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Rent prices by house type
const RENT_TABLE = {
  "Bedsitter": 5000,
  "1-Bedroom": 8000,
  "2-Bedroom": 12000,
  "Studio": 6000, // you can expand later
};

export default function TenantDashboard() {
  const tenantName = localStorage.getItem("userName"); // login saves `userName`
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    async function load() {
      setLoading(true);

      try {
        // 1️⃣ Fetch all tenants
        const res = await fetch(`${API}/api/tenants`);
        const data = await res.json();

        // 2️⃣ Find logged-in tenant by name
        const me = data.find(
          t => t.name?.toLowerCase() === tenantName?.toLowerCase()
        );
        setTenant(me || null);

        // 3️⃣ Fetch landlord messages
        const msgRes = await fetch(`${API}/api/messages`);
        const msgs = await msgRes.json();
        setMessages(msgs || []);

      } catch (error) {
        console.error("Error loading tenant data:", error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [tenantName]);

  if (loading) return <div className="tenant-loading">Loading dashboard...</div>;
  if (!tenant) return (
    <div className="tenant-empty">
      <h2>Tenant not found</h2>
      <p>Please ensure you logged in with the correct name.</p>
    </div>
  );

  // 🟢 Get rent amount based on house type
  const rentAmount = RENT_TABLE[tenant.houseType] ?? "—";

  // 🔵 Payment Handler
  const pay = async (type, amount) => {
    const updated = { ...tenant };

    if (type === "rent") {
      updated.rentPaid = true;
      updated.rentAmount = amount;
    }
    if (type === "water") updated.waterPaid = true;
    if (type === "electricity") updated.electricityPaid = true;

    setTenant(updated); // Optimistic UI update

    try {
      await fetch(`${API}/api/pay/${tenant.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, amount }),
      });
    } catch (err) {
      console.error("Payment failed:", err);
    }
  };

  return (
    <div className="tenant-dashboard">
      <header className="tenant-header">
        <h1>Welcome, {tenant.name}</h1>
        <small>
          House: {tenant.house_number || tenant.house || "—"}<br />
          Type: {tenant.houseType}
        </small>
      </header>

      {/* PAYMENT CARDS */}
      <section className="tenant-cards">

        {/* RENT CARD */}
        <div className="card">
          <h3>Rent</h3>
          <p className={`status ${tenant.rentPaid ? "paid" : "unpaid"}`}>
            {tenant.rentPaid ? "Paid" : `Due: Ksh ${rentAmount}`}
          </p>

          {!tenant.rentPaid && (
            <button onClick={() => pay("rent", rentAmount)}>
              Pay Rent ({rentAmount})
            </button>
          )}
        </div>

        {/* WATER BILL CARD */}
        <div className="card">
          <h3>Water</h3>
          <p className={`status ${tenant.waterPaid ? "paid" : "unpaid"}`}>
            {tenant.waterPaid ? "Paid" : `Due: Ksh ${tenant.water_bill}`}
          </p>
          {!tenant.waterPaid && (
            <button onClick={() => pay("water")}>Pay Water</button>
          )}
        </div>

        {/* ELECTRICITY BILL CARD */}
        <div className="card">
          <h3>Electricity</h3>
          <p className={`status ${tenant.electricityPaid ? "paid" : "unpaid"}`}>
            {tenant.electricityPaid ? "Paid" : `Due: Ksh ${tenant.electricity_bill}`}
          </p>
          {!tenant.electricityPaid && (
            <button onClick={() => pay("electricity")}>Pay Electricity</button>
          )}
        </div>
      </section>

      {/* MESSAGES SECTION */}
      <section className="tenant-messages">
        <h2>Messages from Landlord</h2>
        {messages.length === 0 ? (
          <p className="no-msg">No messages available.</p>
        ) : (
          <ul>
            {messages.map((msg, index) => (
              <li key={index}>
                <strong>{msg.title}</strong>
                <p>{msg.content}</p>
                <small>
                  {new Date(msg.date_sent).toLocaleString()}
                </small>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
