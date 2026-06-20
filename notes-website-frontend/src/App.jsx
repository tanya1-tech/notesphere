import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UploadNotes from './pages/UploadNotes';
import Notes from './pages/Notes';
import Profile from './pages/Profile';
import PDFViewer from './pages/PDFViewer';
import Courses from './pages/Courses';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard'; // ✅ Import AdminDashboard
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import { getProfile } from './services/api';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const { data } = await getProfile();
        console.log('✅ User loaded:', data);
        setUser(data);
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        setUser(null);
      }
    } else {
      console.log('ℹ️ No token found');
      setUser(null);
    }
    setLoading(false);
  };

  const handleLogin = (userData) => {
    console.log('✅ User logged in:', userData);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  console.log('👤 Current user in App:', user);
  console.log('👤 User role:', user?.role);

  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <Navbar user={user} onLogout={handleLogout} />
          <main>
            <Routes>
              <Route path="/" element={<Home user={user} />} />
              <Route 
                path="/login" 
                element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} 
              />
              <Route 
                path="/register" 
                element={!user ? <Register onLogin={handleLogin} /> : <Navigate to="/dashboard" />} 
              />
              <Route 
                path="/dashboard" 
                element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/upload" 
                element={user ? <UploadNotes user={user} /> : <Navigate to="/login" />} 
              />
              <Route path="/notes" element={<Notes />} />
              <Route 
                path="/profile" 
                element={user ? <Profile user={user} /> : <Navigate to="/login" />} 
              />
              <Route path="/courses" element={<Courses />} />
              <Route path="/pdf-viewer" element={<PDFViewer />} />
              <Route path="/about" element={<About user={user} />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* ✅ FIXED ADMIN ROUTE */}
              <Route 
                path="/admin" 
                element={
                  (() => {
                    console.log('🔍 Admin route check:', { 
                      userExists: !!user, 
                      role: user?.role,
                      isAdmin: user?.role === 'admin'
                    });
                    
                    if (!user) {
                      console.log('❌ No user - redirecting to login');
                      return <Navigate to="/login" />;
                    }
                    
                    if (user.role === 'admin') {
                      console.log('✅ User is admin - showing dashboard');
                      return <AdminDashboard />;
                    }
                    
                    console.log('❌ User is not admin - redirecting to home');
                    return <Navigate to="/" />;
                  })()
                } 
              />
            </Routes>
          </main>
          <ToastContainer 
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;