import React from 'react';
import { Link } from 'react-router-dom';

const Home = ({ user }) => {
  return (
    <div className="container">
      {/* Hero Section */}
      <section className="hero">
        <h1>Welcome to Notesphere</h1>
        <p>Your ultimate destination for college notes, study materials, and academic resources</p>
        <div>
          {!user ? (
            <>
              <Link to="/register" className="btn btn-primary" style={{ marginRight: '1rem' }}>
                Get Started
              </Link>
              <Link to="/notes" className="btn btn-secondary">
                Browse Notes
              </Link>
            </>
          ) : (
            <>
              <Link to="/upload" className="btn btn-primary" style={{ marginRight: '1rem' }}>
                Upload Notes
              </Link>
              <Link to="/dashboard" className="btn btn-secondary">
                My Dashboard
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Search Section - Like the Screenshot */}
      <section className="search-section">
        <h2>Download, study and succeed</h2>
        {/* <div className="search-filters">
          <div className="form-group">
            <select className="form-control">
              <option>Which College</option>
              <option>Medicaps University</option>
              <option>IPS Academy</option>
              <option>IIST</option>
              <option>Other</option>
            </select>
          </div>
          <div className="form-group">
            <select className="form-control">
              <option>Which Year</option>
              <option>First Year</option>
              <option>Second Year</option>
              <option>Third Year</option>
              <option>Fourth Year</option>
            </select>
          </div>
          <div className="form-group">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search notes, subjects..." 
            />
          </div>
        </div> */}
      </section>

      {/* About Section */}
      <div className="card">
        <h2>About Notesphere</h2>
        <p>
          NotesEra is a comprehensive platform for students to share and access study materials. 
          Find notes for various subjects, semesters, and branches to excel in your academics.
        </p>
      </div>

      {/* Features Grid */}
      <div className="features-grid">
        <div className="feature-card floating">
          <h3>📚 Wide Collection</h3>
          <p>Access notes from multiple branches and semesters. Comprehensive coverage of all subjects.</p>
        </div>
        <div className="feature-card floating" style={{animationDelay: '0.5s'}}>
          <h3>🚀 Easy Upload</h3>
          <p>Share your notes with the community easily. Simple drag-and-drop interface.</p>
        </div>
        <div className="feature-card floating" style={{animationDelay: '1s'}}>
          <h3>📱 Always Available</h3>
          <p>Access your notes anytime, anywhere. Mobile-friendly and cloud-synced.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;