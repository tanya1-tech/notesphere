import React, { useState } from 'react';
import { toast } from 'react-toastify';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    setTimeout(() => {
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        category: 'general'
      });
      setLoading(false);
    }, 2000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactMethods = [
    {
      icon: '📧',
      title: 'Email Us',
      details: 'tanyapoojari7@gmail.com',
      description: 'Send us an email anytime',
      link: 'mailto:tanyapoojari7@gmail.com'
    },
    {
      icon: '📞',
      title: 'Call Us',
      details: '+91 12345 67890',
      description: 'Mon to Fri: 9am to 6pm',
      link: 'tel:+911234567890'
    },
    {
      icon: '💬',
      title: 'Chat Support',
      details: 'Live Chat',
      description: 'Instant messaging support',
      link: '#chat'
    },
    {
      icon: '📍',
      title: 'Visit Us',
      details: 'Medicaps University, Indore, Madhya Pradesh',
      description: 'Feel free to visit our office',
      link: '#map'
    }
  ];

  const faqs = [
    {
      question: 'How do I upload notes?',
      answer: 'You need to create an account, then go to the Upload page. Select your PDF file, fill in the details, and submit for review.'
    },
    {
      question: 'Are there any restrictions on file size?',
      answer: 'Yes, the maximum file size for PDF uploads is 10MB to ensure fast loading and easy access for all users.'
    },
    {
      question: 'Can I download notes without an account?',
      answer: 'Yes, you can browse and download notes without an account. However, creating an account allows you to upload notes and access additional features.'
    },
    {
      question: 'How long does note approval take?',
      answer: 'Notes are typically reviewed within 24-48 hours. We ensure all content meets our quality guidelines before publishing.'
    }
  ];

  return (
    <div className="container">
      {/* Hero Section */}
      <div className="hero" style={{ textAlign: 'left', padding: '4rem' }}>
        <h1>Get In Touch</h1>
        <p style={{ fontSize: '1.3rem', maxWidth: '600px' }}>
          Have questions, suggestions, or need support? We'd love to hear from you. 
          Reach out to us through any of the channels below.
        </p>
      </div>

      {/* Contact Methods Grid */}
      <div className="features-grid" style={{ marginBottom: '3rem' }}>
        {contactMethods.map((method, index) => (
          <div 
            key={index} 
            className="feature-card"
            style={{ 
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onClick={() => window.open(method.link, '_self')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{method.icon}</div>
            <h3 style={{ color: '#2d3436', marginBottom: '0.5rem' }}>{method.title}</h3>
            <p style={{ 
              color: '#ff6b6b', 
              fontWeight: 'bold', 
              fontSize: '1.1rem',
              marginBottom: '0.5rem'
            }}>
              {method.details}
            </p>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>{method.description}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '4rem' }}>
        {/* Contact Form */}
        <div className="card">
          <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Send us a Message</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Your Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="general">General Inquiry</option>
                <option value="technical">Technical Support</option>
                <option value="content">Content Issue</option>
                <option value="partnership">Partnership</option>
                <option value="suggestion">Suggestion</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Subject *</label>
              <input
                type="text"
                name="subject"
                className="form-control"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="Brief subject of your message"
              />
            </div>

            <div className="form-group">
              <label>Message *</label>
              <textarea
                name="message"
                className="form-control"
                rows="6"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Please describe your inquiry in detail..."
                style={{ resize: 'vertical' }}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span style={{ marginRight: '0.5rem' }}>⏳</span>
                  Sending Message...
                </>
              ) : (
                <>
                  <span style={{ marginRight: '0.5rem' }}>📨</span>
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>

        {/* Office Location & Info */}
        <div>
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>📍 Our Office</h3>
            <div style={{ 
              background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)', 
              height: '200px', 
              borderRadius: '12px',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.2rem',
              fontWeight: 'bold'
            }}>
              🗺️ Interactive Map Coming Soon
            </div>
            
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <span style={{ fontSize: '1.2rem' }}>🏢</span>
                <div>
                  <strong>Notesphere</strong>
                  <p style={{ color: '#666', margin: '0.3rem 0 0 0' }}>
                    Medicaps University<br />
                    Indore, Madhya Pradesh
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <span style={{ fontSize: '1.2rem' }}>⏰</span>
                <div>
                  <strong>Business Hours</strong>
                  <p style={{ color: '#666', margin: '0.3rem 0 0 0' }}>
                    Monday - Friday: 9:00 AM - 6:00 PM<br />
                    Saturday: 10:00 AM - 4:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem' }}>🌐 Follow Us</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
              {[
                { icon: '📘', name: 'Facebook', color: '#1877F2' },
                { icon: '📷', name: 'Instagram', color: '#E4405F' },
                { icon: '🐦', name: 'Twitter', color: '#1DA1F2' },
                { icon: '💼', name: 'LinkedIn', color: '#0A66C2' }
              ].map((social, index) => (
                <div
                  key={index}
                  style={{
                    background: social.color,
                    color: 'white',
                    padding: '1rem',
                    borderRadius: '12px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{social.icon}</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{social.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>Frequently Asked Questions</h2>
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {faqs.map((faq, index) => (
            <div
              key={index}
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '2px solid #e1e5e9',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#ff6b6b';
                e.currentTarget.style.transform = 'translateX(10px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e1e5e9';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <h4 style={{ 
                color: '#2d3436', 
                marginBottom: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{ color: '#ff6b6b' }}>❓</span>
                {faq.question}
              </h4>
              <p style={{ 
                color: '#666', 
                margin: 0,
                lineHeight: '1.6'
              }}>
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Support */}
      <div style={{ 
        background: 'linear-gradient(135deg, #55efc4 0%, #00b894 100%)', 
        color: 'white',
        padding: '3rem',
        borderRadius: '20px',
        textAlign: 'center',
        marginTop: '3rem'
      }}>
        <h2 style={{ marginBottom: '1rem' }}>Need Immediate Help?</h2>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.9 }}>
          Check our comprehensive help center for instant answers to common questions.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn" style={{ 
            background: 'white', 
            color: '#00b894',
            padding: '1rem 2rem'
          }}>
            📚 Visit Help Center
          </button>
          <button className="btn" style={{ 
            background: 'rgba(255,255,255,0.2)', 
            color: 'white', 
            border: '2px solid white',
            padding: '1rem 2rem'
          }}>
            💬 Start Live Chat
          </button>
        </div>
      </div>

      {/* Response Time Info */}
      <div className="card" style={{ textAlign: 'center', marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>⏱️ Our Response Times</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
          <div>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚡</div>
            <strong>Live Chat</strong>
            <p style={{ color: '#666', margin: '0.5rem 0 0 0' }}>Instant</p>
          </div>
          <div>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📧</div>
            <strong>Email</strong>
            <p style={{ color: '#666', margin: '0.5rem 0 0 0' }}>Within 24 hours</p>
          </div>
          <div>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📞</div>
            <strong>Phone</strong>
            <p style={{ color: '#666', margin: '0.5rem 0 0 0' }}>During business hours</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;