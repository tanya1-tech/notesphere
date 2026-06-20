import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login } from '../services/api';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
    
    // ✅ Validation
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await login(formData);
      console.log('📥 Login response:', response);
      
      // ✅ Extract user from response
      const userData = response.data?.user || response.data;
      console.log('👤 User from login:', userData);
      console.log('👤 User role:', userData?.role);
      
      // ✅ Store token and user
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // ✅ Pass user to App
      onLogin(userData);
      
      toast.success('Login successful! 🎉');
      navigate('/dashboard');
    } catch (error) {
      console.error('❌ Login error:', error);
      console.error('❌ Error response:', error.response);
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
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
        Welcome Back! 👋
      </h2>
      <p style={{ 
        textAlign: 'center', 
        color: '#666', 
        marginBottom: '2rem',
        fontSize: '0.95rem'
      }}>
        Login to access your notes and dashboard
      </p>
      
      <form onSubmit={handleSubmit}>
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
            placeholder="Enter your password"
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
              Logging in...
            </>
          ) : (
            'Login'
          )}
        </button>
      </form>

      <div className="auth-link" style={{
        textAlign: 'center',
        marginTop: '1.5rem',
        color: '#666'
      }}>
        Don't have an account? <Link to="/register" style={{
          color: '#6c63ff',
          textDecoration: 'none',
          fontWeight: '600'
        }}>Register here</Link>
      </div>
    </div>
  );
};

export default Login;