import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [pendingNotes, setPendingNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [statsRes, notesRes] = await Promise.all([
        axios.get(`${API_URL}/admin/stats`, config),
        axios.get(`${API_URL}/admin/notes/pending`, config)
      ]);

      setStats(statsRes.data.stats);
      setPendingNotes(notesRes.data.notes);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      if (error.response?.status === 403) {
        toast.error('You do not have admin access');
      } else {
        toast.error('Failed to load admin dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (noteId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`${API_URL}/admin/notes/${noteId}/approve`, {}, config);
      
      setPendingNotes(prev => prev.filter(n => n._id !== noteId));
      setStats(prev => ({
        ...prev,
        pendingNotes: prev.pendingNotes - 1,
        approvedNotes: prev.approvedNotes + 1
      }));
      
      toast.success('Note approved successfully!');
    } catch (error) {
      console.error('Error approving note:', error);
      toast.error('Failed to approve note');
    }
  };

  const handleReject = async (noteId) => {
    const reason = window.prompt('Enter rejection reason:');
    if (reason === null) return;
    
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`${API_URL}/admin/notes/${noteId}/reject`, { reason }, config);
      
      setPendingNotes(prev => prev.filter(n => n._id !== noteId));
      setStats(prev => ({
        ...prev,
        pendingNotes: prev.pendingNotes - 1
      }));
      
      toast.success('Note rejected');
    } catch (error) {
      console.error('Error rejecting note:', error);
      toast.error('Failed to reject note');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-500">Total Notes</p>
            <p className="text-3xl font-bold text-blue-600">{stats?.totalNotes || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-500">Pending Review</p>
            <p className="text-3xl font-bold text-yellow-600">{stats?.pendingNotes || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-500">Approved</p>
            <p className="text-3xl font-bold text-green-600">{stats?.approvedNotes || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="text-3xl font-bold text-purple-600">{stats?.totalUsers || 0}</p>
          </div>
        </div>

        {/* Pending Notes Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Pending Notes ({pendingNotes.length})
            </h2>
            <button
              onClick={fetchData}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Refresh
            </button>
          </div>
          
          {pendingNotes.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎉</div>
              <p className="text-gray-500 text-lg">No pending notes to review!</p>
              <p className="text-gray-400 text-sm">All caught up</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingNotes.map(note => (
                <div key={note._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-800">{note.title}</h3>
                      <p className="text-gray-600 text-sm mt-1 line-clamp-2">{note.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          📚 {note.subject}
                        </span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          🏫 {note.branch}
                        </span>
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                          Semester {note.semester}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {note.course}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                        <span>👤 {note.uploadedBy?.name || 'Unknown'}</span>
                        <span>📧 {note.uploadedBy?.email || 'No email'}</span>
                        <span>📅 {new Date(note.createdAt).toLocaleDateString('en-IN', { 
                          day: '2-digit', 
                          month: 'short', 
                          year: 'numeric' 
                        })}</span>
                        <span>📄 {formatFileSize(note.fileSize)}</span>
                      </div>
                      
                      <div className="mt-2 text-xs text-gray-400 truncate">
                        Filename: {note.file}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4 md:mt-0 md:ml-4">
                      <button
                        onClick={() => handleApprove(note._id)}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium flex items-center gap-1"
                      >
                        ✅ Approve
                      </button>
                      <button
                        onClick={() => handleReject(note._id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium flex items-center gap-1"
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
      </div>
    </div>
  );
};

export default AdminDashboard;