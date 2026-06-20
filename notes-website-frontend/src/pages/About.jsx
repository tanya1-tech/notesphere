import React from 'react';

const About = () => {
  return (
    <div className="container">
      <div className="card">
        <h1>📖 About Notesphere</h1>
        <p style={{ color: '#666', fontSize: '1.1rem', marginTop: '0.5rem' }}>
          Learn more about our mission and how we're helping students succeed.
        </p>
      </div>

      <div className="about-grid">
        <div className="about-card">
          <div className="icon">🎯</div>
          <h3>Our Mission</h3>
          <p style={{ color: '#666' }}>
            To provide free, high-quality study materials to every student, 
            making education accessible to all.
          </p>
        </div>
        <div className="about-card">
          <div className="icon">👥</div>
          <h3>Community Driven</h3>
          <p style={{ color: '#666' }}>
            Built by students, for students. Share your notes and help others learn.
          </p>
        </div>
        <div className="about-card">
          <div className="icon">🌟</div>
          <h3>Quality First</h3>
          <p style={{ color: '#666' }}>
            Every note is reviewed and curated to ensure the highest quality content.
          </p>
        </div>
        <div className="about-card">
          <div className="icon">📚</div>
          <h3>Comprehensive</h3>
          <p style={{ color: '#666' }}>
            Covering all subjects, branches, and semesters across multiple courses.
          </p>
        </div>
      </div>

      <div className="card" style={{ textAlign: 'center' }}>
        <h2>Join Our Community</h2>
        <p style={{ color: '#666', maxWidth: '600px', margin: '0.5rem auto 1.5rem' }}>
          Start your learning journey today. Upload your notes, help others, and excel in your academics.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/register" className="btn btn-primary">Get Started</a>
          <a href="/notes" className="btn btn-secondary">Browse Notes</a>
        </div>
      </div>
    </div>
  );
};

export default About;