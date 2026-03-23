import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Droplet, Menu, MessageCircleQuestion } from 'lucide-react';
import Button from './Button';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  const openAppInfo = () => {
    const chatEvent = new Event('open-jamiebot');
    window.dispatchEvent(chatEvent);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="navbar-logo">
            <div className="logo-icon">
              <Droplet size={24} color="white" fill="white" />
            </div>
            <span className="logo-text">Blood<span className="text-primary">Link</span></span>
          </Link>
        </div>
        
        <div className="navbar-links desktop-only">
          <Link to="/" className="nav-link">Inicio</Link>
          <Link to="/turnos" className="nav-link">Mis Turnos</Link>
          <button 
            className="nav-link text-decoration-none" 
            onClick={openAppInfo}
            style={{ fontWeight: 500, background: 'transparent', padding: '0.5rem', cursor: 'pointer', border: 'none' }}
          >
            FAQ
          </button>
        </div>

        <div className="navbar-actions" style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/admin" className="nav-link" style={{ fontSize: '1rem', opacity: 0.5, marginRight: '0.5rem', textDecoration: 'none' }} title="Portal Admin">🔒</Link>
          <button className="mobile-menu-btn mobile-only">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
