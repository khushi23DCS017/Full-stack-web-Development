import React from 'react';
import { Menu, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-left">
          <button className="menu-btn" onClick={onMenuClick} style={{backgroundColor: '#8b5cf6', color: 'white', padding: '8px', borderRadius: '8px'}}>
            <Menu size={24} />
          </button>
          <h1 className="navbar-title">Taskify</h1>
        </div>
        
        <div className="navbar-right">
          <button className="notification-btn">
            <Bell size={20} />
            <span className="notification-badge">3</span>
          </button>
          
          <div className="user-menu">
            <div className="user-info" onClick={() => window.location.href = '/profile'} style={{cursor: 'pointer', padding: '8px', borderRadius: '8px', backgroundColor: '#f3f4f6'}}>
              <div className="user-avatar">
                <User size={20} />
              </div>
              <span className="user-name">{user?.name}</span>
            </div>
            
            <button className="logout-btn" onClick={logout} title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
