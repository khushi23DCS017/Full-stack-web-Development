// // Sidebar.js
// import React from 'react';
// import { Link } from 'react-router-dom';
// import './App.css';

// const Sidebar = ({ isOpen, toggleSidebar }) => {
//   return (
//     <div className={`sidebar ${isOpen ? 'open' : ''}`}>
//       <button className="toggle-btn" onClick={toggleSidebar}>☰</button>
//       <div className="nav-links">
//         <button>Home</button>
//         <button>About</button>
//         <button>Contact</button>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

// File: src/Sidebar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import homeImg from './logo.svg';
import depstarImg from './logo.svg';
import cseImg from './logo.svg';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [search, setSearch] = useState('');
  const navItems = [
    { label: 'HomePage', to: '/', img: homeImg },
    { label: 'Charusat', to: '/charusat', img: homeImg },
    { label: 'Depstar', to: '/depstar', img: depstarImg },
    { label: 'CSE', to: '/cse', img: cseImg },
    { label: 'About', to: '/about', img: homeImg },
    { label: 'Contact', to: '/contact', img: homeImg },
  ];
  const filteredItems = navItems.filter(item => item.label.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="menu-button" onClick={toggleSidebar}>
        &#9776;
      </button>
      <input
        type="text"
        className="sidebar-search"
        placeholder="Search..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ margin: '20px 0', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', width: '80%' }}
      />
      {filteredItems.map(item => (
        <Link to={item.to} key={item.label} className="sidebar-link">
          <img src={item.img} alt={item.label} style={{ width: 24, height: 24, marginRight: 10, verticalAlign: 'middle' }} />
          {item.label}
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;