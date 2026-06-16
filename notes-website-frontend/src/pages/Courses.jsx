import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getNotes } from '../services/api';

const Courses = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (selectedCourse) {
      loadCourseNotes();
    }
  }, [selectedCourse]);

  const loadCourseNotes = async () => {
    setLoading(true);
    try {
      const filters = {
        course: selectedCourse.name,
        branch: selectedCourse.branch
      };
      const { data } = await getNotes(filters);
      setNotes(data.notes);
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const coursesData = {
    engineering: [
      {
        name: 'Computer Science & Engineering',
        branch: 'Computer Science & Engineering',
        code: 'CSE',
        duration: '4 Years',
        semesters: 8,
        notes: 1250,
        subjects: 45,
        description: 'Focus on computer programming, algorithms, data structures, and software development.',
        popularSubjects: ['Data Structures', 'Algorithms', 'Database Management', 'Operating Systems', 'Computer Networks']
      },
      {
        name: 'Information Technology',
        branch: 'Information Technology',
        code: 'IT',
        duration: '4 Years',
        semesters: 8,
        notes: 890,
        subjects: 38,
        description: 'Emphasis on information systems, networking, and software applications.',
        popularSubjects: ['Web Technologies', 'Network Security', 'Data Analytics', 'Cloud Computing']
      },
      {
        name: 'Electronics & Communication',
        branch: 'Electronics & Communication Engineering',
        code: 'ECE',
        duration: '4 Years',
        semesters: 8,
        notes: 760,
        subjects: 32,
        description: 'Focus on electronic devices, circuits, and communication systems.',
        popularSubjects: ['Digital Electronics', 'Signals & Systems', 'Communication Systems']
      }
    ],
    management: [
      {
        name: 'Business Administration (MBA)',
        branch: 'Management',
        code: 'MBA',
        duration: '2 Years',
        semesters: 4,
        notes: 540,
        subjects: 28,
        description: 'Comprehensive business management and leadership skills.',
        popularSubjects: ['Marketing Management', 'Financial Accounting', 'Business Strategy']
      },
      {
        name: 'Bachelor of Commerce',
        branch: 'Commerce',
        code: 'B.Com',
        duration: '3 Years',
        semesters: 6,
        notes: 420,
        subjects: 24,
        description: 'Focus on commerce, accounting, and business fundamentals.',
        popularSubjects: ['Accounting', 'Business Law', 'Economics', 'Taxation']
      }
    ],
    computerApplications: [
      {
        name: 'Bachelor of Computer Applications',
        branch: 'Computer Applications',
        code: 'BCA',
        duration: '3 Years',
        semesters: 6,
        notes: 890,
        subjects: 35,
        description: 'Foundation in computer applications and programming.',
        popularSubjects: ['Programming in C', 'Web Development', 'Software Engineering']
      },
      {
        name: 'Master of Computer Applications',
        branch: 'Computer Applications',
        code: 'MCA',
        duration: '2 Years',
        semesters: 4,
        notes: 670,
        subjects: 28,
        description: 'Advanced concepts in computer science and applications.',
        popularSubjects: ['Advanced Algorithms', 'Machine Learning', 'Cloud Computing']
      }
    ]
  };

  const categories = [
    { id: 'all', name: 'All Courses', count: Object.values(coursesData).flat().length },
    { id: 'engineering', name: 'Engineering', count: coursesData.engineering.length },
    { id: 'management', name: 'Management', count: coursesData.management.length },
    { id: 'computerApplications', name: 'Computer Applications', count: coursesData.computerApplications.length }
  ];

  const filteredCourses = selectedCategory === 'all' 
    ? Object.values(coursesData).flat() 
    : coursesData[selectedCategory];

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedCourse) {
    return (
      <div className="container">
        {/* Course Header */}
        <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
          <button 
            onClick={() => setSelectedCourse(null)}
            className="btn btn-secondary"
            style={{ position: 'absolute', top: '1rem', right: '1rem' }}
          >
            ← Back to Courses
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              color: 'white',
              fontWeight: 'bold'
            }}>
              {selectedCourse.code.substring(0, 2)}
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ marginBottom: '0.5rem', color: '#2d3436' }}>{selectedCourse.name}</h1>
              <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '0' }}>{selectedCourse.description}</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', color: '#ff6b6b' }}>{selectedCourse.notes}</div>
              <div style={{ color: '#666' }}>Study Materials</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', color: '#74b9ff' }}>{selectedCourse.subjects}</div>
              <div style={{ color: '#666' }}>Subjects</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', color: '#55efc4' }}>{selectedCourse.semesters}</div>
              <div style={{ color: '#666' }}>Semesters</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', color: '#a29bfe' }}>{selectedCourse.duration}</div>
              <div style={{ color: '#666' }}>Duration</div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="card">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'end' }}>
            <div className="form-group">
              <label>Search Notes</label>
              <input
                type="text"
                className="form-control"
                placeholder="Search by title or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Link to="/upload" className="btn btn-primary" style={{ height: 'fit-content' }}>
              📤 Upload Notes
            </Link>
          </div>
        </div>

        {/* Notes Grid */}
        {loading ? (
          <div className="card">
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div className="loading">Loading notes...</div>
            </div>
          </div>
        ) : (
          <div>
            <h2 style={{ marginBottom: '1.5rem', color: '#2d3436' }}>
              Study Materials ({filteredNotes.length})
            </h2>
            
            {filteredNotes.length === 0 ? (
              <div className="card">
                <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📚</div>
                  <h3 style={{ color: '#666', marginBottom: '0.5rem' }}>No notes found</h3>
                  <p style={{ color: '#888', marginBottom: '2rem' }}>
                    {searchTerm ? 'Try adjusting your search terms' : 'Be the first to upload notes for this course!'}
                  </p>
                  <Link to="/upload" className="btn btn-primary">
                    Upload First Notes
                  </Link>
                </div>
              </div>
            ) : (
              <div className="notes-grid">
                {filteredNotes.map((note) => (
                  <div key={note._id} className="note-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <h3>{note.title}</h3>
                      <span style={{
                        background: '#55efc4',
                        color: 'white',
                        padding: '0.3rem 0.8rem',
                        borderRadius: '15px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                      }}>
                        {note.courseCode}
                      </span>
                    </div>
                    
                    <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.9rem' }}>
                      {note.description.length > 120 
                        ? `${note.description.substring(0, 120)}...` 
                        : note.description
                      }
                    </p>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                      <div>
                        <strong>Subject:</strong>
                        <p style={{ margin: '0.2rem 0', color: '#666' }}>{note.subject}</p>
                      </div>
                      <div>
                        <strong>Semester:</strong>
                        <p style={{ margin: '0.2rem 0', color: '#666' }}>{note.semester}</p>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#666' }}>
                        <span>📥 {note.downloads}</span>
                        <span>👁️ {note.views}</span>
                      </div>
                      <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Popular Subjects */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Popular Subjects in {selectedCourse.name}</h3>
          <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
            {selectedCourse.popularSubjects.map((subject, index) => (
              <span
                key={index}
                style={{
                  background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
                onClick={() => setSearchTerm(subject)}
              >
                {subject}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Hero Section */}
      <div className="hero" style={{ textAlign: 'left', padding: '4rem' }}>
        <h1>Explore Courses</h1>
        <p style={{ fontSize: '1.3rem', maxWidth: '600px' }}>
          Discover comprehensive study materials organized by courses and specializations. 
          Find exactly what you need for your academic journey.
        </p>
      </div>

      {/* Category Filters */}
      <div className="card">
        <h3 style={{ marginBottom: '1.5rem' }}>Browse by Category</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`btn ${selectedCategory === category.id ? 'btn-primary' : 'btn-secondary'}`}
              style={{ 
                padding: '0.8rem 1.5rem',
                borderRadius: '25px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {category.name}
              <span style={{ 
                background: 'rgba(255,255,255,0.2)', 
                padding: '0.2rem 0.6rem', 
                borderRadius: '12px',
                fontSize: '0.8rem'
              }}>
                {category.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      <div style={{ display: 'grid', gap: '2rem' }}>
        {filteredCourses.map((course, index) => (
          <div key={index} className="card" style={{ position: 'relative', cursor: 'pointer' }}
               onClick={() => setSelectedCourse(course)}>
            <div style={{ 
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%)',
              color: 'white',
              padding: '0.3rem 0.8rem',
              borderRadius: '15px',
              fontSize: '0.8rem',
              fontWeight: 'bold'
            }}>
              {course.notes}+ Notes
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2rem' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
                borderRadius: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                color: 'white',
                fontWeight: 'bold',
                flexShrink: 0
              }}>
                {course.code}
              </div>

              <div style={{ flex: 1 }}>
                <h3 style={{ color: '#2d3436', marginBottom: '0.5rem', fontSize: '1.4rem' }}>
                  {course.name}
                </h3>
                <p style={{ color: '#666', marginBottom: '1rem' }}>{course.description}</p>

                <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#ff6b6b' }}>📚</span>
                    <span style={{ color: '#666' }}>{course.subjects} Subjects</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#74b9ff' }}>⏱️</span>
                    <span style={{ color: '#666' }}>{course.duration}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#55efc4' }}>🎓</span>
                    <span style={{ color: '#666' }}>{course.semesters} Semesters</span>
                  </div>
                </div>

                <div>
                  <h4 style={{ marginBottom: '0.5rem', color: '#2d3436', fontSize: '1rem' }}>Popular Subjects:</h4>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {course.popularSubjects.slice(0, 4).map((subject, idx) => (
                      <span
                        key={idx}
                        style={{
                          background: 'rgba(116, 185, 255, 0.1)',
                          color: '#0984e3',
                          padding: '0.3rem 0.6rem',
                          borderRadius: '12px',
                          fontSize: '0.8rem'
                        }}
                      >
                        {subject}
                      </span>
                    ))}
                    {course.popularSubjects.length > 4 && (
                      <span style={{ color: '#666', fontSize: '0.8rem' }}>
                        +{course.popularSubjects.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ 
              textAlign: 'center', 
              marginTop: '1.5rem',
              paddingTop: '1.5rem',
              borderTop: '2px dashed #e1e5e9'
            }}>
              <button className="btn btn-primary">
                Explore Course Materials
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div style={{ 
        background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)', 
        color: 'white',
        padding: '3rem',
        borderRadius: '20px',
        textAlign: 'center',
        marginTop: '3rem'
      }}>
        <h2 style={{ marginBottom: '1rem' }}>Can't Find Your Course?</h2>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.9 }}>
          Request specific course materials or contribute by uploading notes for your course.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/contact" className="btn" style={{ background: 'white', color: '#74b9ff' }}>
            Request Course
          </Link>
          <Link to="/upload" className="btn" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '2px solid white' }}>
            Upload Notes
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Courses;