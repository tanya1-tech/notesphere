import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const PDFViewer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const filePath = queryParams.get('file');
  const title = queryParams.get('title') || 'PDF Viewer';
  
  const [pdfUrl, setPdfUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (filePath) {
      // Construct the full URL for the PDF
      // If filePath already has /uploads/, use it directly
      let url = filePath;
      if (filePath.startsWith('/uploads/')) {
        url = `${API_URL}${filePath}`;
      } else if (filePath.startsWith('uploads/')) {
        url = `${API_URL}/${filePath}`;
      } else {
        url = `${API_URL}/uploads/${filePath}`;
      }
      
      setPdfUrl(url);
      setLoading(false);
    } else {
      setError('No PDF file specified');
      setLoading(false);
    }
  }, [filePath, API_URL]);

  const handleDownload = async () => {
    if (!pdfUrl) {
      toast.error('No PDF URL available');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(pdfUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to download: ${response.status}`);
      }
      
      const blob = await response.blob();
      
      // Check if it's actually a PDF
      if (blob.type !== 'application/pdf' && !blob.type.includes('pdf')) {
        // Try to detect if it's a PDF by looking at the first few bytes
        const buffer = await blob.arrayBuffer();
        const header = new Uint8Array(buffer.slice(0, 4));
        // PDF signature: %PDF
        const isPdf = header[0] === 37 && header[1] === 80 && header[2] === 68 && header[3] === 70;
        
        if (!isPdf) {
          throw new Error('File is not a valid PDF');
        }
      }
      
      // Create download link
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      setTimeout(() => URL.revokeObjectURL(link.href), 5000);
      
      toast.success('Download started!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error(error.message || 'Failed to download file');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        width: '100%', 
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f5f5f5'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p>Loading PDF...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        width: '100%', 
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f5f5f5'
      }}>
        <div style={{ 
          textAlign: 'center',
          padding: '2rem',
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
          <h3 style={{ color: '#d32f2f' }}>Error Loading PDF</h3>
          <p style={{ color: '#666' }}>{error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="btn btn-primary"
            style={{ marginTop: '1rem' }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      width: '100%', 
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#f5f5f5'
    }}>
      {/* Toolbar */}
      <div style={{ 
        background: 'white', 
        padding: '0.75rem 1.5rem', 
        borderBottom: '2px solid #e1e5e9',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.5rem',
        zIndex: 10,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button 
            onClick={() => navigate(-1)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.2rem',
              cursor: 'pointer',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
              hover: { background: '#f0f0f0' }
            }}
          >
            ←
          </button>
          <h3 style={{ margin: 0, fontSize: '1rem', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {title}
          </h3>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={handleDownload}
            className="btn btn-primary"
            style={{ 
              padding: '0.5rem 1rem',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            📥 Download PDF
          </button>
          <button 
            onClick={() => window.open(pdfUrl, '_blank')}
            className="btn btn-secondary"
            style={{ 
              padding: '0.5rem 1rem',
              fontSize: '0.9rem'
            }}
          >
            Open in New Tab
          </button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div style={{ 
        flex: 1,
        position: 'relative',
        background: '#f5f5f5'
      }}>
        <iframe
          src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            position: 'absolute',
            top: 0,
            left: 0
          }}
          title={title}
          onError={() => {
            setError('Failed to load PDF document. Please try downloading it instead.');
          }}
        />
      </div>

      {/* Add spinning animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default PDFViewer;