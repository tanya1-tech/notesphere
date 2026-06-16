import React from 'react';

const PDFViewer = ({ pdfUrl, title }) => {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <div style={{ 
        background: 'white', 
        padding: '1rem', 
        borderBottom: '2px solid #e1e5e9',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3>{title}</h3>
        <a 
          href={pdfUrl} 
          download 
          className="btn btn-primary"
        >
          📥 Download PDF
        </a>
      </div>
      <iframe
        src={pdfUrl}
        style={{
          width: '100%',
          height: 'calc(100vh - 80px)',
          border: 'none'
        }}
        title={title}
      />
    </div>
  );
};

export default PDFViewer;