import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { register } from '../services/api';

const Register = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const { data } = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      localStorage.setItem('token', data.token);
      onLogin(data.user);
      toast.success('Registration successful! 🎉');
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{
      background: 'white',
      padding: '2.5rem',
      borderRadius: '16px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
      maxWidth: '450px',
      margin: '2rem auto',
      border: '1px solid #e8eaff'
    }}>
      <h2 style={{ 
        textAlign: 'center', 
        marginBottom: '0.5rem',
        color: '#1a1a2e',
        fontSize: '2rem'
      }}>
        Create Account 🚀
      </h2>
      <p style={{ 
        textAlign: 'center', 
        color: '#666', 
        marginBottom: '2rem',
        fontSize: '0.95rem'
      }}>
        Join Notesphere and start learning today
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name" style={{ color: '#1a1a2e' }}>Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            disabled={loading}
            style={{
              padding: '0.75rem 1rem',
              border: '2px solid #e8eaff',
              borderRadius: '10px',
              fontSize: '1rem',
              color: '#1a1a2e',
              background: 'white'
            }}
          />
          {errors.name && <div className="invalid-feedback" style={{ color: '#ff6b6b' }}>{errors.name}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="email" style={{ color: '#1a1a2e' }}>Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            disabled={loading}
            style={{
              padding: '0.75rem 1rem',
              border: '2px solid #e8eaff',
              borderRadius: '10px',
              fontSize: '1rem',
              color: '#1a1a2e',
              background: 'white'
            }}
          />
          {errors.email && <div className="invalid-feedback" style={{ color: '#ff6b6b' }}>{errors.email}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="password" style={{ color: '#1a1a2e' }}>Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            value={formData.password}
            onChange={handleChange}
            placeholder="Min 6 characters"
            disabled={loading}
            style={{
              padding: '0.75rem 1rem',
              border: '2px solid #e8eaff',
              borderRadius: '10px',
              fontSize: '1rem',
              color: '#1a1a2e',
              background: 'white'
            }}
          />
          {errors.password && <div className="invalid-feedback" style={{ color: '#ff6b6b' }}>{errors.password}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword" style={{ color: '#1a1a2e' }}>Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            disabled={loading}
            style={{
              padding: '0.75rem 1rem',
              border: '2px solid #e8eaff',
              borderRadius: '10px',
              fontSize: '1rem',
              color: '#1a1a2e',
              background: 'white'
            }}
          />
          {errors.confirmPassword && <div className="invalid-feedback" style={{ color: '#ff6b6b' }}>{errors.confirmPassword}</div>}
        </div>

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.8rem',
            fontSize: '1rem',
            borderRadius: '10px',
            marginTop: '0.5rem',
            color: 'white'
          }}
        >
          {loading ? (
            <>
              <span className="spinner" style={{ marginRight: '0.5rem' }}></span>
              Creating account...
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      <div className="auth-link" style={{
        textAlign: 'center',
        marginTop: '1.5rem',
        color: '#666'
      }}>
        Already have an account? <Link to="/login" style={{
          color: '#6c63ff',
          textDecoration: 'none',
          fontWeight: '600'
        }}>Login here</Link>
      </div>
    </div>
  );
};

export default Register;