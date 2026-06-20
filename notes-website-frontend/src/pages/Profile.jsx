import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getProfile } from '../services/api';

const Profile = ({ user }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const { data } = await getProfile();
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container">
        <div className="error">Failed to load profile</div>
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
              <p>{profile.name || 'Not set'}</p>
            </div>
            
            <div>
              <strong>Email:</strong>
              <p>{profile.email || 'Not set'}</p>
            </div>
            
            <div>
              <strong>Mobile:</strong>
              <p>{profile.mobile || 'Not set'}</p>
            </div>
            
            <div>
              <strong>Address:</strong>
              <p>{profile.address || 'Not set'}</p>
            </div>
            
            <div>
              <strong>City:</strong>
              <p>{profile.city || 'Not set'}</p>
            </div>
            
            <div>
              <strong>Gender:</strong>
              <p>{profile.gender || 'Not set'}</p>
            </div>
            
            <div>
              <strong>Role:</strong>
              <p style={{
                color: profile.role === 'admin' ? '#e17055' : '#00b894',
                fontWeight: 'bold'
              }}>
                {profile.role || 'user'}
              </p>
            </div>
            
            <div>
              <strong>Member Since:</strong>
              <p>{profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
              }) : 'Not available'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;