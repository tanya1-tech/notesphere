import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getNotes } from '../services/api';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    semester: '',
    branch: '',
    subject: '',
    course: ''
  });

  useEffect(() => {
    loadNotes();
  }, [filters]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      console.log('Loading notes with filters:', filters);
      
      const { data } = await getNotes(filters);
      console.log('API Response:', data);
      
      setNotes(data.notes || []);
      
      if (data.notes && data.notes.length > 0) {
        console.log('First note details:', data.notes[0]);
      }
      
    } catch (error) {
      console.error('Error loading notes:', error);
      toast.error('Failed to load notes: ' + error.message);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewPDF = (note) => {
    const pdfUrl = `http://localhost:5000/uploads/${note.file}`;
    console.log('Opening PDF:', pdfUrl);
    window.open(pdfUrl, '_blank');
  };

  const handleDownload = async (note) => {
    try {
      const pdfUrl = `http://localhost:5000/uploads/${note.file}`;
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', `${note.title}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Download started!');
    } catch (error) {
      toast.error('Download failed');
    }
  };

  // Test direct API call
  const testDirectAPI = async () => {
    try {
      console.log('Testing direct API call...');
      const response = await fetch('http://localhost:5000/api/notes/debug/all');
      const data = await response.json();
      console.log('Direct API response:', data);
      toast.info(`Found ${data.total} notes in database`);
    } catch (error) {
      console.error('Direct API test failed:', error);
      toast.error('API test failed: ' + error.message);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Browse All Notes</h1>
        <p>Discover study materials uploaded by students from various courses and branches.</p>
        
        {/* Debug buttons */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
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
      <div className="filters">
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
      <div className="card">
        <h3>Debug Information</h3>
        <p><strong>Notes Count:</strong> {notes.length}</p>
        <p><strong>Current Filters:</strong> {JSON.stringify(filters)}</p>
        <p><strong>Loading State:</strong> {loading ? 'Loading...' : 'Loaded'}</p>
      </div>

      {loading ? (
        <div className="card">
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="loading">Loading notes...</div>
          </div>
        </div>
      ) : (
        <div className="notes-grid">
          {notes.length === 0 ? (
            <div className="card">
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📚</div>
                <h3>No notes found</h3>
                <p style={{ color: '#666', marginBottom: '2rem' }}>
                  No notes matching your criteria were found.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
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
              <div key={note._id} className="note-card">
                <h3>{note.title}</h3>
                <p><strong>Subject:</strong> {note.subject}</p>
                <p><strong>Course:</strong> {note.course}</p>
                <p><strong>Branch:</strong> {note.branch}</p>
                <p><strong>Semester:</strong> {note.semester}</p>
                <p><strong>Status:</strong> 
                  <span style={{
                    color: note.status === 'approved' ? 'green' : 'orange',
                    marginLeft: '0.5rem'
                  }}>
                    {note.status}
                  </span>
                </p>
                <p><strong>File:</strong> {note.file}</p>
                
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button 
                    onClick={() => handleViewPDF(note)}
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                  >
                    👁️ View PDF
                  </button>
                  <button 
                    onClick={() => handleDownload(note)}
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
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