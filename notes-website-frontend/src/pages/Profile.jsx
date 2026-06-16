import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getProfile } from '../services/api';

const Profile = ({ user }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data } = await getProfile();
      setProfile(data);
    } catch (error) {
      toast.error('Failed to load profile');
    }
  };

  if (!profile) {
    return (
      <div className="container">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div className="card">
          <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Your Profile</h2>
          
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div>
              <strong>Name:</strong>
              <p>{profile.name}</p>
            </div>
            
            <div>
              <strong>Email:</strong>
              <p>{profile.email}</p>
            </div>
            
            <div>
              <strong>Mobile:</strong>
              <p>{profile.mobile}</p>
            </div>
            
            <div>
              <strong>Address:</strong>
              <p>{profile.address}</p>
            </div>
            
            <div>
              <strong>City:</strong>
              <p>{profile.city}</p>
            </div>
            
            <div>
              <strong>Gender:</strong>
              <p>{profile.gender}</p>
            </div>
            
            <div>
              <strong>Role:</strong>
              <p>{profile.role}</p>
            </div>
            
            <div>
              <strong>Member Since:</strong>
              <p>{new Date(profile.info).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;