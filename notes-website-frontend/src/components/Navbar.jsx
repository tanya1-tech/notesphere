import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        📚 Notes<span>phere</span>
      </Link>
      
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/notes">Notes</Link></li>
        <li><Link to="/courses">Courses</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        
        {user ? (
          <>
            <li><Link to="/dashboard" style={{ color: '#6c63ff' }}>Dashboard</Link></li>
            
            {/* ✅ ADMIN LINK - Only visible to admin users */}
            {user.role === 'admin' && (
              <li>
                <Link 
                  to="/admin"
                  style={{
                    background: 'linear-gradient(135deg, #e17055, #d63031)',
                    color: 'white',
                    padding: '0.5rem 1.5rem',
                    borderRadius: '8px',
                    fontWeight: '600',
                    textDecoration: 'none',
                    transition: 'all 0.3s',
                    boxShadow: '0 4px 15px rgba(214, 48, 49, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(214, 48, 49, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(214, 48, 49, 0.3)';
                  }}
                >
                  🛡️ Admin
                </Link>
              </li>
            )}
            
            <li>
              <Link 
                to="/upload" 
                style={{
                  background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
                  color: 'white',
                  padding: '0.5rem 1.5rem',
                  borderRadius: '8px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(255, 107, 107, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(255, 107, 107, 0.3)';
                }}
              >
                📤 Upload
              </Link>
            </li>
            <li>
              <button 
                onClick={onLogout}
                style={{
                  background: 'linear-gradient(135deg, #ff6b6b, #d63031)',
                  color: 'white',
                  padding: '0.5rem 1.5rem',
                  borderRadius: '8px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(255, 107, 107, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(255, 107, 107, 0.3)';
                }}
              >
                🚪 Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link 
                to="/login"
                style={{
                  background: 'linear-gradient(135deg, #6c63ff, #8b83ff)',
                  color: 'white',
                  padding: '0.5rem 1.5rem',
                  borderRadius: '8px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 15px rgba(108, 99, 255, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(108, 99, 255, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(108, 99, 255, 0.3)';
                }}
              >
                🔑 Login
              </Link>
            </li>
            <li>
              <Link 
                to="/register"
                style={{
                  background: 'linear-gradient(135deg, #00d97e, #00b894)',
                  color: 'white',
                  padding: '0.5rem 1.5rem',
                  borderRadius: '8px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 15px rgba(0, 217, 126, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(0, 217, 126, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(0, 217, 126, 0.3)';
                }}
              >
                ✨ Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;