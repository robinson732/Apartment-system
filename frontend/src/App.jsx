import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Signup from "./pages/SignUp.jsx";
import Login from "./pages/Login.jsx";
import TenantLanding from "./pages/TenantLanding.jsx";
import RoomSelection from "./pages/RoomSelection.jsx";
import TenantDashboard from "./pages/Tenants.jsx";
import TenantPaymentDashboard from "./pages/TenantDashboard.jsx";
import LandlordDashboard from "./pages/Landlord.jsx";
import Navbar from "./pages/Navbar.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/tenant-home" element={<TenantLanding />} />
        <Route path="/room-selection" element={<RoomSelection />} />
        <Route path="/tenants" element={<TenantDashboard />} />
        <Route path="/tenant" element={<TenantPaymentDashboard />} />
        <Route path="/landlord" element={<LandlordDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
