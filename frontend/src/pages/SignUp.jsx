import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SignUp.css";

export default function Signup() {
  const navigate = useNavigate();
  const [signupRole, setSignupRole] = useState("tenant");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const role = sessionStorage.getItem("signupRole");
    if (role) {
      setSignupRole(role);
      sessionStorage.removeItem("signupRole");
    }
  }, []);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: signupRole,
    accessCode: ""
  });

  useEffect(() => {
    setForm(prev => ({ ...prev, role: signupRole }));
  }, [signupRole]);

  const validateForm = () => {
    const newErrors = {};
    
    // Name only required for tenants
    if (form.role === "tenant" && !form.name.trim()) newErrors.name = "Name is required";
    
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Invalid email";
    
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    
    if (form.role === "landlord") {
      if (!form.accessCode) newErrors.accessCode = "Access code is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ submit: data.error || "Signup failed" });
        setLoading(false);
        return;
      }
      
      navigate("/login");
    } catch (err) {
      setErrors({ submit: "Network error. Please try again." });
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join us today</p>
        </div>

        <form onSubmit={submit} className="auth-form">
          {errors.submit && <div className="error-message">{errors.submit}</div>}

          {form.role === "tenant" && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={e => {
                  setForm({...form, name: e.target.value});
                  if (errors.name) setErrors({...errors, name: ""});
                }}
                className={errors.name ? "input-error" : ""}
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => {
                setForm({...form, email: e.target.value});
                if (errors.email) setErrors({...errors, email: ""});
              }}
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="At least 6 characters"
              value={form.password}
              onChange={e => {
                setForm({...form, password: e.target.value});
                if (errors.password) setErrors({...errors, password: ""});
              }}
              className={errors.password ? "input-error" : ""}
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="role">I am a</label>
            <select
              id="role"
              value={form.role}
              onChange={e => setForm({...form, role: e.target.value})}
            >
              <option value="tenant">Tenant</option>
              <option value="landlord">Landlord</option>
            </select>
          </div>

          {form.role === "landlord" && (
            <div className="form-group">
              <label htmlFor="accessCode">Landlord Access Code</label>
              <input
                id="accessCode"
                type="password"
                placeholder="Enter landlord access code"
                value={form.accessCode}
                onChange={e => {
                  setForm({...form, accessCode: e.target.value});
                  if (errors.accessCode) setErrors({...errors, accessCode: ""});
                }}
                className={errors.accessCode ? "input-error" : ""}
              />
              {errors.accessCode && <span className="field-error">{errors.accessCode}</span>}
            </div>
          )}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <a href="/login">Sign In</a></p>
        </div>
      </div>
    </div>
  );
}
