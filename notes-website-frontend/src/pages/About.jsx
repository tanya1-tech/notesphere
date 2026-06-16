import React from 'react';

const About = ({user }) => {
  return (
    <div className="page-container">
    <div className="container">
      {/* Hero Section */}
      <div className="hero" style={{ textAlign: 'left', padding: '4rem' }}>
        <h1>About Notesphere</h1>
        <p style={{ fontSize: '1.3rem', maxWidth: '600px' }}>
          Empowering students with quality educational resources and fostering a collaborative learning environment.
        </p>
      </div>

      {/* Mission & Vision */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
        <div className="card">
          <h3>🎯 Our Mission</h3>
          <p>
            To create a comprehensive platform where students can easily access, share, and collaborate 
            on study materials. We believe in the power of shared knowledge and aim to make quality 
            education accessible to every student.
          </p>
        </div>
        
        <div className="card">
          <h3>👁️ Our Vision</h3>
          <p>
            To become the most trusted student community platform for academic resources, 
            where learning is collaborative, accessible, and effective for students across 
            all educational institutions.
          </p>
        </div>
      </div>

      {/* What We Offer */}
      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>What We Offer</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>📚 Comprehensive Notes</h3>
            <p>
              Access well-organized notes covering various subjects, semesters, and branches. 
              From engineering to management, we've got you covered.
            </p>
          </div>
          
          <div className="feature-card">
            <h3>🤝 Community Driven</h3>
            <p>
              A platform built by students, for students. Share your knowledge and learn from 
              peers across different colleges and universities.
            </p>
          </div>
          
          <div className="feature-card">
            <h3>🔍 Easy Discovery</h3>
            <p>
              Advanced search and filtering options to help you find exactly what you need. 
              Filter by semester, branch, subject, or keywords.
            </p>
          </div>
          
          <div className="feature-card">
            <h3>📱 Always Accessible</h3>
            <p>
              Access your study materials anytime, anywhere. Our platform is optimized for 
              all devices - desktop, tablet, and mobile.
            </p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>Our Impact</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">10,000+</div>
            <div className="stat-label">Study Materials</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">5,000+</div>
            <div className="stat-label">Active Students</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">50+</div>
            <div className="stat-label">Colleges</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">100+</div>
            <div className="stat-label">Subjects Covered</div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>Behind NotesEra</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%)', 
              width: '120px', 
              height: '120px', 
              borderRadius: '50%', 
              margin: '0 auto 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem'
            }}>
              👨‍💻
            </div>
            <h3>Developers</h3>
            <p>Passionate developers building the platform with cutting-edge technology.</p>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)', 
              width: '120px', 
              height: '120px', 
              borderRadius: '50%', 
              margin: '0 auto 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem'
            }}>
              🎓
            </div>
            <h3>Student Contributors</h3>
            <p>Dedicated students sharing their knowledge and helping peers succeed.</p>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #55efc4 0%, #00b894 100%)', 
              width: '120px', 
              height: '120px', 
              borderRadius: '50%', 
              margin: '0 auto 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem'
            }}>
              🌟
            </div>
            <h3>Community</h3>
            <p>Amazing community members who make learning collaborative and fun.</p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div style={{ 
        background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%)', 
        color: 'white',
        padding: '3rem',
        borderRadius: '20px',
        textAlign: 'center',
        marginTop: '3rem'
      }}>
        <h2 style={{ marginBottom: '1rem' }}>Join Our Learning Community</h2>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.9 }}>
          Start sharing knowledge and accessing quality study materials today.
        </p>
        <a href="/register" className="btn btn-secondary" style={{ background: 'white', color: '#ff6b6b' }}>
          Get Started Now
        </a>
      </div>
    </div>
    </div>
  );
};

export default About;