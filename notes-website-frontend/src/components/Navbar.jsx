import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo" onClick={() => setIsMenuOpen(false)}>
          <span className="logo-full">NOTESPHERE</span>
          <span className="logo-short">NOTES<br/>SPHERE</span>
        </Link>

        <button 
          className="nav-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation"
        >
          <span className="hamburger"></span>
        </button>
        
        <div className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
          <Link to="/" className={isActive('/')} onClick={() => setIsMenuOpen(false)}>
            Home
          </Link>
          <Link to="/notes" className={isActive('/notes')} onClick={() => setIsMenuOpen(false)}>
            Notes
          </Link>
          <Link to="/courses" className={isActive('/courses')} onClick={() => setIsMenuOpen(false)}>
            Courses
          </Link>
          <Link to="/about" className={isActive('/about')} onClick={() => setIsMenuOpen(false)}>
            About
          </Link>
          <Link to="/contact" className={isActive('/contact')} onClick={() => setIsMenuOpen(false)}>
            Contact
          </Link>
          
          {user ? (
            <>
              <Link to="/dashboard" className={isActive('/dashboard')} onClick={() => setIsMenuOpen(false)}>
                Dashboard
              </Link>
              <Link to="/upload" className={isActive('/upload')} onClick={() => setIsMenuOpen(false)}>
                Upload
              </Link>
              <span className="user-welcome">
                Hi, {user.name?.split(' ')[0] || 'User'}
              </span>
              <button 
                onClick={() => {
                  onLogout();
                  setIsMenuOpen(false);
                }} 
                className="logout-btn"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-login" onClick={() => setIsMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="nav-join" onClick={() => setIsMenuOpen(false)}>
                Join Us
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;