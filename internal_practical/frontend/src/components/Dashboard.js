import { useEffect, useState } from "react";
import api from "../lib/api";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user);
      } catch (e) {
        // ignore; PrivateRoute should guard
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, []);

  if (loading) return <div className="centered"><div className="card"><p>Loading...</p></div></div>;
  if (!user) return <div className="centered"><div className="card"><p>Not authorized</p></div></div>;

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="dashboard">
      <div className="panel hero">
        <div className="avatar">{user.name?.[0]?.toUpperCase() || "U"}</div>
        <div>
          <h2>Welcome, {user.name}</h2>
          <p className="muted">Email: {user.email}</p>
        </div>
      </div>
      <div className="panel stack">
        <div className="row">
          <span className="hint">You are logged in. Keep your token private.</span>
          <span className="right" />
          <button className="btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
}


