import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getNotes } from '../services/api';

const Notes = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    semester: '',
    branch: '',
    subject: '',
    course: ''
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = localStorage.getItem('token');

  useEffect(() => {
    loadNotes();
  }, [filters]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      console.log('Loading notes with filters:', filters);
      
      const { data } = await getNotes(filters);
      console.log('API Response:', data);
      
      // Filter only approved notes for public viewing
      const approvedNotes = (data.notes || []).filter(note => note.status === 'approved');
      setNotes(approvedNotes);
      
      console.log('Approved notes:', approvedNotes.length);
      
    } catch (error) {
      console.error('Error loading notes:', error);
      toast.error('Failed to load notes: ' + error.message);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewPDF = (note) => {
    try {
      // Construct the PDF URL
      let pdfUrl;
      const filename = note.file;
      
      if (filename.startsWith('/uploads/')) {
        pdfUrl = `${API_URL}${filename}`;
      } else if (filename.startsWith('uploads/')) {
        pdfUrl = `${API_URL}/${filename}`;
      } else {
        pdfUrl = `${API_URL}/uploads/${filename}`;
      }
      
      console.log('Opening PDF:', pdfUrl);
      
      // Open in new tab as fallback
      const newWindow = window.open(pdfUrl, '_blank');
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        // If popup blocked, navigate to PDF viewer
        navigate(`/pdf-viewer?file=${encodeURIComponent(filename)}&title=${encodeURIComponent(note.title)}`);
      }
    } catch (error) {
      console.error('Error viewing PDF:', error);
      toast.error('Failed to open PDF');
    }
  };

  const handleDownload = async (note) => {
    try {
      const filename = note.file;
      let pdfUrl;
      
      if (filename.startsWith('/uploads/')) {
        pdfUrl = `${API_URL}${filename}`;
      } else if (filename.startsWith('uploads/')) {
        pdfUrl = `${API_URL}/${filename}`;
      } else {
        pdfUrl = `${API_URL}/uploads/${filename}`;
      }
      
      console.log('Downloading from:', pdfUrl);
      
      // Fetch the file with auth token if needed
      const response = await fetch(pdfUrl, {
        headers: token ? {
          'Authorization': `Bearer ${token}`
        } : {}
      });
      
      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
      }
      
      const blob = await response.blob();
      
      // Create download link
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${note.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      setTimeout(() => URL.revokeObjectURL(link.href), 5000);
      
      toast.success('Download started!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Download failed: ' + error.message);
      
      // Fallback: Try direct download
      try {
        const filename = note.file;
        let pdfUrl;
        
        if (filename.startsWith('/uploads/')) {
          pdfUrl = `${API_URL}${filename}`;
        } else if (filename.startsWith('uploads/')) {
          pdfUrl = `${API_URL}/${filename}`;
        } else {
          pdfUrl = `${API_URL}/uploads/${filename}`;
        }
        
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = `${note.title}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success('Download started using fallback method!');
      } catch (fallbackError) {
        toast.error('Please try opening in new tab and save from there');
      }
    }
  };

  // Test direct API call
  const testDirectAPI = async () => {
    try {
      console.log('Testing direct API call...');
      const response = await fetch(`${API_URL}/api/notes/debug/all`);
      const data = await response.json();
      console.log('Direct API response:', data);
      toast.info(`Found ${data.total} notes in database`);
    } catch (error) {
      console.error('Direct API test failed:', error);
      toast.error('API test failed: ' + error.message);
    }
  };

const handleViewPDF = (note) => {
  try {
    // ✅ Use Cloudinary URL if available
    const pdfUrl = note.fileUrl || `${API_URL}/uploads/${note.file}`;
    console.log('📄 Opening PDF:', pdfUrl);
    window.open(pdfUrl, '_blank');
  } catch (error) {
    console.error('Error viewing PDF:', error);
    toast.error('Failed to open PDF');
  }
};

const handleDownload = async (note) => {
  try {
    const pdfUrl = note.fileUrl || `${API_URL}/uploads/${note.file}`;
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${note.title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Download started!');
  } catch (error) {
    console.error('Download error:', error);
    toast.error('Download failed');
  }
};

  return (
    <div className="container">
      <div className="card">
        <h1>📚 Browse All Notes</h1>
        <p>Discover study materials uploaded by students from various courses and branches.</p>
        
        {/* Debug buttons */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          <button onClick={loadNotes} className="btn btn-secondary">
            🔄 Reload Notes
          </button>
          <button onClick={testDirectAPI} className="btn btn-secondary">
            🐛 Test API
          </button>
          <button 
            onClick={() => {
              setFilters({ semester: '', branch: '', subject: '', course: '' });
              toast.info('Filters cleared');
            }} 
            className="btn btn-secondary"
          >
            🧹 Clear Filters
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div className="form-group">
          <label>Semester</label>
          <select 
            className="form-control"
            value={filters.semester} 
            onChange={(e) => setFilters({...filters, semester: e.target.value})}
          >
            <option value="">All Semesters</option>
            {[1,2,3,4,5,6,7,8].map(sem => (
              <option key={sem} value={sem}>Semester {sem}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Branch</label>
          <select 
            className="form-control"
            value={filters.branch} 
            onChange={(e) => setFilters({...filters, branch: e.target.value})}
          >
            <option value="">All Branches</option>
            <option value="Computer Science & Engineering">Computer Science</option>
            <option value="Information Technology">IT</option>
            <option value="Electronics & Communication Engineering">ECE</option>
            <option value="Mechanical Engineering">Mechanical</option>
            <option value="Civil Engineering">Civil</option>
            <option value="Electrical Engineering">Electrical</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Course</label>
          <select 
            className="form-control"
            value={filters.course} 
            onChange={(e) => setFilters({...filters, course: e.target.value})}
          >
            <option value="">All Courses</option>
            <option value="B.Tech">B.Tech</option>
            <option value="B.E.">B.E.</option>
            <option value="M.Tech">M.Tech</option>
            <option value="MBA">MBA</option>
            <option value="BCA">BCA</option>
            <option value="MCA">MCA</option>
            <option value="B.Sc">B.Sc</option>
            <option value="M.Sc">M.Sc</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Subject</label>
          <input
            type="text"
            className="form-control"
            placeholder="Search by subject..."
            value={filters.subject}
            onChange={(e) => setFilters({...filters, subject: e.target.value})}
          />
        </div>
      </div>

      {/* Debug Info */}
      {notes.length > 0 && (
        <div className="card" style={{ background: '#f8f9fa', marginBottom: '2rem' }}>
          <h3>📊 Summary</h3>
          <p><strong>Showing:</strong> {notes.length} approved notes</p>
        </div>
      )}

      {loading ? (
        <div className="card">
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="loading">Loading notes...</div>
          </div>
        </div>
      ) : (
        <div className="notes-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {notes.length === 0 ? (
            <div className="card" style={{ gridColumn: '1 / -1' }}>
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📚</div>
                <h3>No notes found</h3>
                <p style={{ color: '#666', marginBottom: '2rem' }}>
                  No approved notes matching your criteria were found.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => setFilters({ semester: '', branch: '', subject: '', course: '' })}
                    className="btn btn-primary"
                  >
                    Clear All Filters
                  </button>
                  <button onClick={loadNotes} className="btn btn-secondary">
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          ) : (
            notes.map(note => (
              <div key={note._id} className="note-card" style={{
                background: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem'
                  }}>
                    <span style={{ fontSize: '1.5rem' }}>📄</span>
                    <h3 style={{ 
                      margin: 0, 
                      fontSize: '1.1rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {note.title}
                    </h3>
                  </div>
                  
                  <p style={{ 
                    color: '#666', 
                    fontSize: '0.9rem',
                    margin: '0.5rem 0',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {note.description}
                  </p>
                  
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '0.5rem',
                    marginTop: '0.5rem'
                  }}>
                    <span style={{
                      background: '#e3f2fd',
                      color: '#1976d2',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem'
                    }}>
                      {note.subject}
                    </span>
                    <span style={{
                      background: '#f3e5f5',
                      color: '#7b1fa2',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem'
                    }}>
                      {note.branch}
                    </span>
                    <span style={{
                      background: '#e8f5e9',
                      color: '#2e7d32',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem'
                    }}>
                      Sem {note.semester}
                    </span>
                    <span style={{
                      background: '#fff3e0',
                      color: '#e65100',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem'
                    }}>
                      {note.course}
                    </span>
                  </div>
                  
                  <div style={{
                    marginTop: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    fontSize: '0.8rem',
                    color: '#888'
                  }}>
                    <span>👤 {note.uploadedBy?.name || 'Unknown'}</span>
                    <span>📥 {note.downloads || 0}</span>
                    <span>👁️ {note.views || 0}</span>
                  </div>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  gap: '0.5rem', 
                  marginTop: '1rem',
                  borderTop: '1px solid #eee',
                  paddingTop: '1rem'
                }}>
                  <button 
                    onClick={() => handleViewPDF(note)}
                    className="btn btn-primary"
                    style={{ 
                      flex: 1,
                      padding: '0.5rem',
                      fontSize: '0.85rem'
                    }}
                  >
                    👁️ View
                  </button>
                  <button 
                    onClick={() => handleDownload(note)}
                    className="btn btn-secondary"
                    style={{ 
                      flex: 1,
                      padding: '0.5rem',
                      fontSize: '0.85rem'
                    }}
                  >
                    📥 Download
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Notes;