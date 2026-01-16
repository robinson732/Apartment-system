import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/RoomSelection.css";

export default function RoomSelection() {
  const navigate = useNavigate();
  const [selectedRoom, setSelectedRoom] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const roomTypes = [
    { id: "Bedsitter", label: "Bedsitter", icon: "🪑" },
    { id: "1-Bedroom", label: "1 Bedroom", icon: "🛏️" },
    { id: "2-Bedroom", label: "2 Bedroom", icon: "🛏️🛏️" },
  ];

  const handleRoomSelect = async (e) => {
    e.preventDefault();

    if (!selectedRoom) {
      setError("Please select a room type");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      // Try to update room type in backend
      try {
        const res = await fetch("http://localhost:5000/api/tenants/select-room", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ room_type: selectedRoom })
        });

        if (!res.ok) {
          console.warn("Failed to save room type to backend, proceeding anyway");
        }
      } catch (err) {
        console.warn("Backend update failed, proceeding with frontend storage", err);
      }

      // Always save selected house type and redirect (critical for dashboard)
      localStorage.setItem("selectedHouseType", selectedRoom);
      setLoading(false);
      navigate("/tenant");
    } catch (err) {
      setError("Navigation error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="room-selection-container">
      <div className="room-selection-card">
        <div className="room-selection-header">
          <h1>Select Your Room Type</h1>
          <p>Choose the type of accommodation you're looking for</p>
        </div>

        <form onSubmit={handleRoomSelect} className="room-selection-form">
          {error && <div className="error-message">{error}</div>}

          <div className="room-grid">
            {roomTypes.map((room) => (
              <div
                key={room.id}
                className={`room-option ${selectedRoom === room.id ? "selected" : ""}`}
                onClick={() => setSelectedRoom(room.id)}
              >
                <div className="room-icon">{room.icon}</div>
                <div className="room-label">{room.label}</div>
                {selectedRoom === room.id && (
                  <div className="room-checkmark">✓</div>
                )}
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="room-selection-button"
            disabled={loading || !selectedRoom}
          >
            {loading ? "Selecting..." : "Continue to Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}
