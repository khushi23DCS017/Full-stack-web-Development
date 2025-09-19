import { useState } from "react";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setSuccess("");
      setLoading(true);
      const payload = { 
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password
      };
      await api.post("/auth/register", payload);
      setSuccess("Registered successfully!");
      navigate("/login");
    } catch (error) {
      const msg = error?.response?.data?.message || "Error";
      setError(msg);
    }
    finally { setLoading(false); }
  };

  return (
    <div className="centered">
      <div className="card">
        <h2>Create account</h2>
        <p className="muted">Join with your email and password</p>
        <form className="form" onSubmit={handleSubmit}>
          <div className="field">
            <label className="label">Name</label>
            <input className="input" name="name" placeholder="Your name" onChange={handleChange} />
            <div className="helper">Use your real name; it appears on the dashboard.</div>
          </div>
          <div className="field">
            <label className="label">Email</label>
            <input className="input" name="email" type="email" placeholder="you@example.com" onChange={handleChange} />
            <div className="helper">We’ll never share your email.</div>
          </div>
          <div className="field">
            <label className="label">Password</label>
            <input className="input" name="password" type="password" placeholder="••••••••" onChange={handleChange} />
            <div className="helper">At least 6 characters for demo purposes.</div>
          </div>
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
          <button className="btn" type="submit" disabled={loading}>{loading ? "Submitting..." : "Register"}</button>
        </form>
      </div>
    </div>
  );
}
