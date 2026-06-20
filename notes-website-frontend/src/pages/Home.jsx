import React from 'react';
import { Link } from 'react-router-dom';

const Home = ({ user }) => {
  return (
    <div className="container">
      {/* Hero Section */}
      <div className="hero">
        <h1>Welcome to Notesphere</h1>
        <p>Your ultimate destination for college notes, study materials, and academic resources</p>
        <div className="hero-buttons">
          {user ? (
            <>
              <Link to="/upload" className="btn-hero-primary">📤 Upload Notes</Link>
              <Link to="/dashboard" className="btn-hero-secondary">📊 My Dashboard</Link>
            </>
          ) : (
            <>
              <Link to="/register" className="btn-hero-primary">🚀 Get Started</Link>
              <Link to="/notes" className="btn-hero-secondary">📚 Browse Notes</Link>
            </>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">📚</div>
          <h3>Wide Collection</h3>
          <p>Access notes from multiple branches and semesters. Comprehensive coverage of all subjects.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">👨‍🎓</div>
          <h3>Student Community</h3>
          <p>Join thousands of students sharing and learning together. Upload and download notes easily.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📱</div>
          <h3>Easy Access</h3>
          <p>View notes online, download PDFs, and study anytime, anywhere on any device.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">⭐</div>
          <h3>Quality Content</h3>
          <p>All notes are reviewed and curated to ensure high-quality study materials.</p>
        </div>
      </div>

      {/* About Section */}
      <div className="card">
        <h2 style={{ marginBottom: '1rem' }}>About Notesphere</h2>
        <p style={{ color: '#666', fontSize: '1.05rem' }}>
          Notesphere is a comprehensive platform for students to share and access study materials. 
          Find notes for various subjects, semesters, and branches to excel in your academics.
        </p>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginTop: '2rem'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#6c63ff' }}>10K+</div>
            <div style={{ color: '#666' }}>Students</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#6c63ff' }}>5K+</div>
            <div style={{ color: '#666' }}>Notes Available</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#6c63ff' }}>50+</div>
            <div style={{ color: '#666' }}>Subjects</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#6c63ff' }}>20+</div>
            <div style={{ color: '#666' }}>Branches</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;