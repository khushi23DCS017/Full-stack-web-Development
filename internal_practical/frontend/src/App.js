import { BrowserRouter, Routes, Route, Link, Navigate, NavLink } from "react-router-dom";
import "./App.css";
import { useEffect, useState } from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

const isAuthed = () => !!localStorage.getItem("token");
const PrivateRoute = ({ children }) => (isAuthed() ? children : <Navigate to="/login" replace />);

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  useEffect(() => {
    document.documentElement.classList.remove("theme-light", "theme-dark");
    document.documentElement.classList.add(theme === "light" ? "theme-light" : "theme-dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <div className="container">
        <nav className="nav">
          <Link className="brand" to="/">MERN Auth</Link>
          <span className="spacer" />
          <NavLink to="/register" className={({isActive}) => isActive ? "active" : undefined}>Register</NavLink>
          <NavLink to="/login" className={({isActive}) => isActive ? "active" : undefined}>Login</NavLink>
          <button className="toggle theme-toggle" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>{theme === "light" ? "Dark" : "Light"} mode</button>
        </nav>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
        <div className="footer">Built by <strong>Khushi</strong> — MERN Auth Demo</div>
      </div>
    </BrowserRouter>
  );
}

export default App;
