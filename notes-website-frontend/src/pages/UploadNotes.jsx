import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { uploadNote } from '../services/api';

const UploadNotes = ({ user }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    semester: '',
    branch: '',
    course: '',
    courseCode: '',
    credits: 3,
    tags: ''
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = React.useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Please select a PDF file');
      return;
    }

    if (file.type !== 'application/pdf') {
      toast.error('Please upload only PDF files');
      return;
    }

    setLoading(true);

    const uploadData = new FormData();
    uploadData.append('title', formData.title);
    uploadData.append('description', formData.description);
    uploadData.append('subject', formData.subject);
    uploadData.append('semester', formData.semester);
    uploadData.append('branch', formData.branch);
    uploadData.append('course', formData.course);
    uploadData.append('courseCode', formData.courseCode);
    uploadData.append('credits', formData.credits);
    uploadData.append('tags', formData.tags);
    uploadData.append('file', file);

    try {
      const response = await uploadNote(uploadData);
      console.log('Upload response:', response);
      
      toast.success('Notes uploaded successfully!');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        subject: '',
        semester: '',
        branch: '',
        course: '',
        courseCode: '',
        credits: 3,
        tags: ''
      });
      setFile(null);
      
      // Reset file input using ref
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        toast.success('PDF file selected successfully!');
      } else {
        toast.error('Please select a PDF file only');
        e.target.value = '';
      }
    }
  };

  const branches = [
    'Computer Science & Engineering',
    'Information Technology',
    'Electronics & Communication Engineering',
    'Mechanical Engineering',
    'Civil Engineering'
  ];

  const courses = [
    'B.Tech',
    'B.E.',
    'M.Tech',
    'MBA',
    'BCA',
    'MCA'
  ];

  return (
    <div className="container">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="card">
          <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Upload Study Notes</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                name="title"
                className="form-control"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Data Structures Complete Notes"
                required
              />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                className="form-control"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the content of your notes..."
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Subject *</label>
                <input
                  type="text"
                  name="subject"
                  className="form-control"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g., Data Structures"
                  required
                />
              </div>

              <div className="form-group">
                <label>Semester *</label>
                <select
                  name="semester"
                  className="form-control"
                  value={formData.semester}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Semester</option>
                  {[1,2,3,4,5,6,7,8].map(sem => (
                    <option key={sem} value={sem}>Semester {sem}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Branch *</label>
                <select
                  name="branch"
                  className="form-control"
                  value={formData.branch}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Branch</option>
                  {branches.map(branch => (
                    <option key={branch} value={branch}>{branch}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Course *</label>
                <select
                  name="course"
                  className="form-control"
                  value={formData.course}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Course</option>
                  {courses.map(course => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Course Code (Optional)</label>
                <input
                  type="text"
                  name="courseCode"
                  className="form-control"
                  value={formData.courseCode}
                  onChange={handleChange}
                  placeholder="e.g., CS301"
                />
              </div>

              <div className="form-group">
                <label>Credits</label>
                <select
                  name="credits"
                  className="form-control"
                  value={formData.credits}
                  onChange={handleChange}
                >
                  {[1,2,3,4,5].map(credit => (
                    <option key={credit} value={credit}>{credit} Credit{credit > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Tags (Optional)</label>
              <input
                type="text"
                name="tags"
                className="form-control"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g., programming, algorithms (separate with commas)"
              />
            </div>

            <div className="form-group">
              <label>PDF File *</label>
              <input
                ref={fileInputRef}
                type="file"
                className="form-control"
                accept=".pdf"
                onChange={handleFileChange}
                required
              />
              {file && (
                <p style={{ color: '#666', marginTop: '0.5rem' }}>
                  Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? 'Uploading...' : 'Upload Notes'}
            </button>
          </form>

          {/* Upload Guidelines */}
          <div style={{ 
            background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)', 
            color: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            marginTop: '2rem'
          }}>
            <h4 style={{ marginBottom: '0.5rem' }}>📝 Upload Guidelines</h4>
            <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
              <li>Only PDF files are accepted (Max size: 10MB)</li>
              <li>Ensure notes are clear, readable, and properly formatted</li>
              <li>Include relevant topics and chapters in description</li>
              <li>Provide accurate course information for better organization</li>
              <li>Don't upload copyrighted material</li>
              <li>Notes will be reviewed before publishing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadNotes;