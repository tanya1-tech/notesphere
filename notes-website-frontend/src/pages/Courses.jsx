import React from 'react';
import { Link } from 'react-router-dom';

const Courses = () => {
  const courses = [
    { 
      id: 1, 
      name: 'Computer Science & Engineering', 
      icon: '💻', 
      notes: 1250,
      description: 'Data Structures, Algorithms, Programming, AI/ML'
    },
    { 
      id: 2, 
      name: 'Information Technology', 
      icon: '🌐', 
      notes: 980,
      description: 'Web Development, Networking, Database'
    },
    { 
      id: 3, 
      name: 'Electronics & Communication', 
      icon: '📡', 
      notes: 720,
      description: 'Digital Circuits, Communication Systems'
    },
    { 
      id: 4, 
      name: 'Mechanical Engineering', 
      icon: '⚙️', 
      notes: 650,
      description: 'Thermodynamics, Fluid Mechanics, Design'
    },
    { 
      id: 5, 
      name: 'Civil Engineering', 
      icon: '🏗️', 
      notes: 580,
      description: 'Structural Analysis, Construction, Surveying'
    },
    { 
      id: 6, 
      name: 'Electrical Engineering', 
      icon: '⚡', 
      notes: 450,
      description: 'Power Systems, Machines, Control Systems'
    },
  ];

  return (
    <div className="container">
      <div className="card">
        <h1>🎓 Explore Courses</h1>
        <p style={{ color: '#666', fontSize: '1.05rem', marginTop: '0.5rem' }}>
          Discover comprehensive study materials organized by courses and specializations. 
          Find exactly what you need for your academic journey.
        </p>
      </div>

      <div className="courses-grid">
        {courses.map(course => (
          <Link to={`/notes?course=${course.name}`} key={course.id} style={{ textDecoration: 'none' }}>
            <div className="course-card">
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{course.icon}</div>
              <h3>{course.name}</h3>
              <p>{course.description}</p>
              <div className="course-stats">
                <span>📚 {course.notes}+ Notes</span>
                <span>🔗 View All</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Courses;