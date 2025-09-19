import { useState } from "react";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      const payload = { email: form.email.trim().toLowerCase(), password: form.password };
      const res = await api.post("/auth/login", payload);
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (error) {
      const msg = error?.response?.data?.message || "Error";
      setError(msg);
    }
    finally { setLoading(false); }
  };

  return (
    <div className="centered">
      <div className="card">
        <h2>Login</h2>
        <p className="muted">Access your account</p>
        <form className="form" onSubmit={handleSubmit}>
          <div className="field">
            <label className="label">Email</label>
            <input className="input" name="email" type="email" placeholder="you@example.com" onChange={handleChange} />
          </div>
          <div className="field">
            <label className="label">Password</label>
            <input className="input" name="password" type="password" placeholder="••••••••" onChange={handleChange} />
          </div>
          {error && <div className="error">{error}</div>}
          <button className="btn" type="submit" disabled={loading}>{loading ? "Signing in..." : "Login"}</button>
        </form>
      </div>
    </div>
  );
}
