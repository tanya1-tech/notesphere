import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

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
  const [errors, setErrors] = useState({});
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

 const validateForm = () => {
  const newErrors = {};
  
  if (!formData.title.trim()) newErrors.title = 'Title is required';
  if (formData.title.length > 200) newErrors.title = 'Title cannot exceed 200 characters';
  if (!formData.description.trim()) newErrors.description = 'Description is required';
  if (formData.description.length > 2000) newErrors.description = 'Description cannot exceed 2000 characters';
  if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
  if (!formData.semester) newErrors.semester = 'Semester is required';
  if (!formData.branch) newErrors.branch = 'Branch is required';
  if (!formData.course) newErrors.course = 'Course is required';
  
  // ✅ File validation
  if (!file) {
    newErrors.file = 'Please select a PDF file';
  } else if (file.size > 30 * 1024 * 1024) {
    newErrors.file = 'File size must be less than 30MB';
  }
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    const uploadData = new FormData();
    
    // Append all form fields
    Object.keys(formData).forEach(key => {
      if (formData[key] !== undefined && formData[key] !== '') {
        uploadData.append(key, formData[key]);
      }
    });
    
    // ✅ Append file
    if (file) {
      uploadData.append('file', file);
      console.log('📄 File attached:', file.name, file.size);
    } else {
      toast.error('Please select a file');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login first');
        setLoading(false);
        return;
      }

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      console.log('📤 Uploading to:', `${API_URL}/api/notes/upload`);
      console.log('📄 File:', file?.name);
      console.log('📏 File size:', file?.size);
      console.log('📝 Form data:', Object.fromEntries(uploadData));

      const response = await fetch(`${API_URL}/api/notes/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: uploadData
      });
      
      // ✅ Log response status
      console.log('📥 Response status:', response.status);

      // ✅ Try to parse response
      let data;
      try {
        data = await response.json();
        console.log('📥 Response data:', data);
      } catch (parseError) {
        console.error('❌ Failed to parse response:', parseError);
        // Try to get text response
        const text = await response.text();
        console.log('📥 Raw response:', text);
        throw new Error('Server returned invalid response');
      }
      
      if (response.ok) {
        setUploadProgress(100);
        toast.success('Notes uploaded successfully! 🎉 Waiting for approval.');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        // ✅ Show detailed error
        const errorMessage = data.message || data.error || 'Upload failed';
        toast.error(errorMessage);
        console.error('❌ Upload error:', data);
        setUploadProgress(0);
      }
    } catch (error) {
      console.error('❌ Upload error:', error);
      toast.error(error.message || 'Network error. Please check your connection.');
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      if (selectedFile.type !== 'application/pdf') {
        toast.error('Please select a PDF file only');
        e.target.value = '';
        setErrors(prev => ({ ...prev, file: 'Only PDF files are allowed' }));
        return;
      }
      
      // Validate file size (30MB)
      if (selectedFile.size > 30 * 1024 * 1024) {
        toast.error('File size exceeds 30MB limit');
        e.target.value = '';
        setErrors(prev => ({ ...prev, file: 'File size must be less than 30MB' }));
        return;
      }
      
      setFile(selectedFile);
      setErrors(prev => ({ ...prev, file: '' }));
      toast.success(`Selected: ${selectedFile.name} (${(selectedFile.size / 1024 / 1024).toFixed(2)} MB)`);
    }
  };

  const branches = [
    'Computer Science & Engineering',
    'Information Technology',
    'Electronics & Communication Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering',
    'Chemical Engineering',
    'Aerospace Engineering',
    'Biotechnology',
    'Food Technology'
  ];

  const courses = [
    'B.Tech',
    'B.E.',
    'M.Tech',
    'MBA',
    'BCA',
    'MCA',
    'B.Sc',
    'M.Sc',
    'B.Com',
    'M.Com',
    'BA',
    'MA'
  ];

  return (
    <div className="container upload-page">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="card">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2>📤 Upload Study Notes</h2>
            <p style={{ color: '#666' }}>
              Share your knowledge with the community
            </p>
          </div>
          
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Data Structures Complete Notes"
                disabled={loading}
                maxLength={200}
              />
              {errors.title && <div className="invalid-feedback">{errors.title}</div>}
              <small className="form-text">{formData.title.length}/200 characters</small>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the content of your notes..."
                disabled={loading}
                maxLength={2000}
              />
              {errors.description && <div className="invalid-feedback">{errors.description}</div>}
              <small className="form-text">{formData.description.length}/2000 characters</small>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className={`form-control ${errors.subject ? 'is-invalid' : ''}`}
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g., Data Structures"
                  disabled={loading}
                />
                {errors.subject && <div className="invalid-feedback">{errors.subject}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="semester">Semester *</label>
                <select
                  id="semester"
                  name="semester"
                  className={`form-control ${errors.semester ? 'is-invalid' : ''}`}
                  value={formData.semester}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="">Select Semester</option>
                  {[1,2,3,4,5,6,7,8].map(sem => (
                    <option key={sem} value={sem}>Semester {sem}</option>
                  ))}
                </select>
                {errors.semester && <div className="invalid-feedback">{errors.semester}</div>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="branch">Branch *</label>
                <select
                  id="branch"
                  name="branch"
                  className={`form-control ${errors.branch ? 'is-invalid' : ''}`}
                  value={formData.branch}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="">Select Branch</option>
                  {branches.map(branch => (
                    <option key={branch} value={branch}>{branch}</option>
                  ))}
                </select>
                {errors.branch && <div className="invalid-feedback">{errors.branch}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="course">Course *</label>
                <select
                  id="course"
                  name="course"
                  className={`form-control ${errors.course ? 'is-invalid' : ''}`}
                  value={formData.course}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="">Select Course</option>
                  {courses.map(course => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
                {errors.course && <div className="invalid-feedback">{errors.course}</div>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="courseCode">Course Code (Optional)</label>
                <input
                  type="text"
                  id="courseCode"
                  name="courseCode"
                  className="form-control"
                  value={formData.courseCode}
                  onChange={handleChange}
                  placeholder="e.g., CS301"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="credits">Credits</label>
                <select
                  id="credits"
                  name="credits"
                  className="form-control"
                  value={formData.credits}
                  onChange={handleChange}
                  disabled={loading}
                >
                  {[1,2,3,4,5].map(credit => (
                    <option key={credit} value={credit}>{credit} Credit{credit > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="tags">Tags (Optional)</label>
              <input
                type="text"
                id="tags"
                name="tags"
                className="form-control"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g., programming, algorithms (separate with commas)"
                disabled={loading}
              />
              <small className="form-text">Separate tags with commas</small>
            </div>

            <div className="form-group">
              <label htmlFor="file">PDF File *</label>
              <div className="file-upload-wrapper">
                <input
                  ref={fileInputRef}
                  type="file"
                  id="file"
                  className={`form-control ${errors.file ? 'is-invalid' : ''}`}
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  disabled={loading}
                />
                {errors.file && <div className="invalid-feedback">{errors.file}</div>}
                {file && (
                  <div className="file-info" style={{
                    marginTop: '0.5rem',
                    padding: '0.5rem',
                    background: '#e8f5e9',
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span>📄 {file.name}</span>
                    <span>({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                    <button 
                      type="button"
                      className="file-remove"
                      onClick={() => {
                        setFile(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#d32f2f',
                        cursor: 'pointer',
                        fontSize: '1.2rem'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                )}
                <small className="form-text">Maximum file size: 30MB. Only PDF files are accepted.</small>
              </div>
            </div>

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="progress-bar" style={{
                marginTop: '1rem',
                background: '#f5f5f5',
                borderRadius: '4px',
                height: '20px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${uploadProgress}%`,
                    background: 'linear-gradient(90deg, #55efc4, #00b894)',
                    height: '100%',
                    transition: 'width 0.3s ease'
                  }}
                />
                <span className="progress-text" style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  {uploadProgress}% uploaded
                </span>
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary upload-btn"
              disabled={loading}
              style={{
                width: '100%',
                marginTop: '1rem',
                padding: '1rem',
                fontSize: '1.1rem'
              }}
            >
              {loading ? (
                <>
                  <span className="spinner" style={{ marginRight: '0.5rem' }}></span>
                  {uploadProgress > 0 ? `Uploading ${uploadProgress}%...` : 'Uploading...'}
                </>
              ) : (
                '📤 Upload Notes'
              )}
            </button>
          </form>

          {/* Upload Guidelines */}
          <div className="upload-guidelines">
  <h4>📝 Upload Guidelines</h4>
  <ul>
    <li>Only PDF files are accepted (Max size: <strong>30MB</strong>)</li>
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