import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          <span className="logo-full">NOTESPHERE</span>
          <span className="logo-short">NOTES<br/>SPHERE</span>
        </Link>
        
        <div className="nav-menu">
          <Link to="/">Home</Link>
          <Link to="/notes">Notes</Link>
          <Link to="/courses">Courses</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          
          {user ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/upload">Upload</Link>
              <span className="user-welcome">Hi, {user.name.split(' ')[0]}</span>
              <button onClick={onLogout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-login">Login</Link>
              <Link to="/register" className="nav-join">Join Us</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;