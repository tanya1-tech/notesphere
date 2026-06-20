import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Dashboard = ({ user }) => {
  const [userStats, setUserStats] = useState({
    notesUploaded: 0,
    totalDownloads: 0,
    totalViews: 0,
    reputation: 0
  });
  const [userNotes, setUserNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserNotes();
  }, []);

  const loadUserNotes = async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem('token');
    
    console.log('📥 Fetching user notes...');
    
    const response = await fetch(`${API_URL}/api/notes/user/my-notes`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('📥 Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('📥 Notes data:', data);
      
      const notes = data.notes || [];
      setUserNotes(notes);
      
      const stats = {
        notesUploaded: notes.length,
        totalDownloads: notes.reduce((sum, note) => sum + (note.downloads || 0), 0),
        totalViews: notes.reduce((sum, note) => sum + (note.views || 0), 0),
        reputation: notes.length * 5
      };
      setUserStats(stats);
    } else {
      const error = await response.json();
      console.error('❌ Failed to load notes:', error);
      toast.error(error.message || 'Failed to load your notes');
    }
  } catch (error) {
    console.error('❌ Error loading user notes:', error);
    toast.error('Error loading your notes');
  } finally {
    setLoading(false);
  }
};
  const recentNotes = userNotes.slice(0, 3);

  const popularSubjects = [
    { name: 'Data Structures', notes: 45 },
    { name: 'Algorithms', notes: 38 },
    { name: 'Operating Systems', notes: 32 },
    { name: 'Computer Networks', notes: 28 }
  ];

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Welcome Section */}
      <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '200px',
          height: '200px',
          background: 'linear-gradient(135deg, rgba(255,107,107,0.1) 0%, rgba(116,185,255,0.1) 100%)',
          borderRadius: '50%',
          transform: 'translate(80px, -80px)'
        }}></div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            color: 'white',
            fontWeight: 'bold',
            flexShrink: 0
          }}>
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          
          <div style={{ flex: 1, minWidth: '300px' }}>
            <h1 style={{ 
              marginBottom: '0.5rem', 
              background: 'linear-gradient(135deg, #ff6b6b, #74b9ff)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent',
              fontSize: 'clamp(1.5rem, 4vw, 2.5rem)'
            }}>
              Welcome back, {user?.name || 'User'}!
            </h1>
            <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '0' }}>
              Manage your notes and track your contributions to the community.
            </p>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, #55efc4 0%, #00b894 100%)',
            color: 'white',
            padding: '0.5rem 1.5rem',
            borderRadius: '25px',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            flexShrink: 0
          }}>
            ⭐ {userStats.reputation} Reputation
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ fontSize: '2rem' }}>📚</div>
            <div style={{ 
              background: 'rgba(255,255,255,0.2)', 
              padding: '0.3rem 0.8rem', 
              borderRadius: '15px',
              fontSize: '0.8rem'
            }}>
              Your uploads
            </div>
          </div>
          <div className="stat-number">{userStats.notesUploaded}</div>
          <div className="stat-label">Notes Uploaded</div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ fontSize: '2rem' }}>📥</div>
            <div style={{ 
              background: 'rgba(255,255,255,0.2)', 
              padding: '0.3rem 0.8rem', 
              borderRadius: '15px',
              fontSize: '0.8rem'
            }}>
              Total downloads
            </div>
          </div>
          <div className="stat-number">{userStats.totalDownloads}</div>
          <div className="stat-label">Total Downloads</div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ fontSize: '2rem' }}>👁️</div>
            <div style={{ 
              background: 'rgba(255,255,255,0.2)', 
              padding: '0.3rem 0.8rem', 
              borderRadius: '15px',
              fontSize: '0.8rem'
            }}>
              Total views
            </div>
          </div>
          <div className="stat-number">{userStats.totalViews}</div>
          <div className="stat-label">Total Views</div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="dashboard-main">
        <div>
          {/* Quick Actions */}
          <div className="card">
            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>⚡</span>
              Quick Actions
            </h2>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                borderRadius: '15px',
                transition: 'all 0.3s ease'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%)',
                  borderRadius: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  color: 'white'
                }}>
                  📤
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ marginBottom: '0.3rem', color: '#2d3436' }}>Upload Notes</h3>
                  <p style={{ color: '#666', margin: 0, fontSize: '0.9rem' }}>Share your study materials with other students</p>
                </div>
                <Link to="/upload" className="btn btn-primary">
                  Upload
                </Link>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                borderRadius: '15px',
                transition: 'all 0.3s ease'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
                  borderRadius: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  color: 'white'
                }}>
                  📚
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ marginBottom: '0.3rem', color: '#2d3436' }}>Browse Notes</h3>
                  <p style={{ color: '#666', margin: 0, fontSize: '0.9rem' }}>Find study materials for your courses</p>
                </div>
                <Link to="/notes" className="btn btn-secondary">
                  Browse
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Uploads */}
          <div className="card" style={{ marginTop: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>📋</span>
              Your Recent Notes
            </h2>
            {userNotes.length > 0 ? (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {recentNotes.map((note) => (
                  <div key={note._id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    background: 'white',
                    border: '2px solid #e1e5e9',
                    borderRadius: '12px',
                    transition: 'all 0.3s ease'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: note.status === 'approved' 
                        ? 'linear-gradient(135deg, #55efc4 0%, #00b894 100%)'
                        : note.status === 'pending'
                        ? 'linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%)'
                        : 'linear-gradient(135deg, #ff7675 0%, #d63031 100%)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem',
                      color: 'white'
                    }}>
                      {note.status === 'approved' ? '✓' : note.status === 'pending' ? '⏳' : '✗'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 0.3rem 0', color: '#2d3436' }}>{note.title}</h4>
                      <p style={{ margin: 0, color: '#666', fontSize: '0.8rem' }}>
                        {note.subject} • {note.downloads || 0} downloads • 
                        <span style={{ 
                          color: note.status === 'approved' ? '#00b894' : 
                                 note.status === 'pending' ? '#fdcb6e' : '#d63031',
                          fontWeight: 'bold'
                        }}>
                          {' '}{note.status === 'approved' ? 'Published' : 
                             note.status === 'pending' ? 'Under Review' : 'Rejected'}
                        </span>
                      </p>
                    </div>
                    <Link 
                      to={`/notes`} 
                      className="btn btn-secondary" 
                      style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                    >
                      View
                    </Link>
                  </div>
                ))}
                {userNotes.length > 3 && (
                  <Link to="/notes" className="btn btn-secondary" style={{ textAlign: 'center' }}>
                    View All Your Notes ({userNotes.length})
                  </Link>
                )}
              </div>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '3rem 2rem',
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                borderRadius: '12px'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
                <h3 style={{ color: '#666', marginBottom: '0.5rem' }}>No notes uploaded yet</h3>
                <p style={{ color: '#888', marginBottom: '1.5rem' }}>Start sharing your knowledge with the community</p>
                <Link to="/upload" className="btn btn-primary">
                  Upload Your First Note
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="dashboard-sidebar">
          {/* Popular Subjects */}
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🔥</span>
              Popular Subjects
            </h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {popularSubjects.map((subject, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                  borderRadius: '10px',
                  border: '1px solid #e1e5e9'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    color: 'white',
                    fontWeight: 'bold'
                  }}>
                    {index + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '0.9rem', color: '#2d3436' }}>
                      {subject.name}
                    </h4>
                    <p style={{ margin: 0, color: '#666', fontSize: '0.8rem' }}>
                      {subject.notes} notes available
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>📈</span>
              Your Impact
            </h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#666' }}>Notes Shared</span>
                <span style={{ fontWeight: 'bold', color: '#ff6b6b' }}>{userStats.notesUploaded}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#666' }}>Knowledge Shared</span>
                <span style={{ fontWeight: 'bold', color: '#74b9ff' }}>{userStats.totalDownloads} times</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#666' }}>Students Helped</span>
                <span style={{ fontWeight: 'bold', color: '#55efc4' }}>{userStats.totalViews}+</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#666' }}>Community Rank</span>
                <span style={{ fontWeight: 'bold', color: '#a29bfe' }}>
                  {userStats.notesUploaded === 0 ? 'New Member' : 
                   userStats.notesUploaded < 5 ? 'Contributor' : 
                   userStats.notesUploaded < 10 ? 'Active Member' : 'Top Contributor'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;