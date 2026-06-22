import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from '../services/api';

const AdminDashboard = () => {
  const [pendingNotes, setPendingNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingNotes();
  }, []);

  const loadPendingNotes = async () => {
    try {
      setLoading(true);
      const response = await API.get('/notes/pending');
      setPendingNotes(response.data.notes || []);
    } catch (error) {
      console.error('Error loading pending notes:', error);
      toast.error('Failed to load pending notes');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (noteId) => {
    try {
      await API.put(`/notes/${noteId}/approve`);
      toast.success('✅ Note approved!');
      loadPendingNotes();
    } catch (error) {
      toast.error('Failed to approve note');
    }
  };

  const handleReject = async (noteId) => {
    const reason = prompt('Enter rejection reason:');
    if (reason === null) return;
    
    try {
      await API.put(`/notes/${noteId}/reject`, { reason });
      toast.success('❌ Note rejected');
      loadPendingNotes();
    } catch (error) {
      toast.error('Failed to reject note');
    }
  };

  return (
    <div className="container">
      <h2>📋 Admin Dashboard</h2>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Approve or reject notes submitted by users
      </p>

      {pendingNotes.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
          <h3>No pending notes!</h3>
          <p style={{ color: '#666' }}>All notes have been reviewed.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {pendingNotes.map(note => (
            <div key={note._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ 
                      background: '#ffeaa7', 
                      padding: '0.2rem 0.8rem', 
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      color: '#6c5200'
                    }}>
                      ⏳ Pending
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#666' }}>
                      {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h3 style={{ marginBottom: '0.5rem' }}>{note.title}</h3>
                  <p style={{ color: '#666', marginBottom: '1rem' }}>{note.description}</p>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ background: '#e3f2fd', padding: '0.2rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem' }}>
                      📚 {note.subject}
                    </span>
                    <span style={{ background: '#f3e5f5', padding: '0.2rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem' }}>
                      🏫 {note.branch}
                    </span>
                    <span style={{ background: '#e8f5e9', padding: '0.2rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem' }}>
                      Semester {note.semester}
                    </span>
                  </div>
                  
                  <div style={{ fontSize: '0.85rem', color: '#888' }}>
                    👤 Uploaded by: {note.uploadedBy?.name || 'Unknown'} ({note.uploadedBy?.email || 'No email'})
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <button 
                    onClick={() => handleApprove(note._id)}
                    className="btn btn-success"
                    style={{ padding: '0.5rem 1rem' }}
                  >
                    ✅ Approve
                  </button>
                  <button 
                    onClick={() => handleReject(note._id)}
                    className="btn btn-danger"
                    style={{ padding: '0.5rem 1rem' }}
                  >
                    ❌ Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;