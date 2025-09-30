import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Calendar, 
  Settings,
  Save,
  Edit
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/auth/profile');
      setProfile(response.data);
      setFormData({
        name: response.data.name,
        email: response.data.email,
        avatar: response.data.avatar || ''
      });
    } catch (error) {
      toast.error('Failed to fetch profile');
      // Set default profile data if API fails
      setProfile({
        name: user?.name || 'User',
        email: user?.email || 'user@example.com',
        avatar: user?.avatar || ''
      });
      setFormData({
        name: user?.name || 'User',
        email: user?.email || 'user@example.com',
        avatar: user?.avatar || ''
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/auth/profile', formData);
      toast.success('Profile updated successfully');
      setEditing(false);
      fetchProfile();
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  // If no profile data, show a fallback
  if (!profile && !loading) {
    return (
      <div className="profile-page">
        <div className="page-header">
          <h1 className="page-title">Profile</h1>
          <p className="page-subtitle">Manage your account settings and preferences</p>
        </div>
        <div className="profile-content">
          <div className="card">
            <div className="card-content">
              <p>Unable to load profile data. Please try refreshing the page.</p>
              <button onClick={() => window.location.reload()} className="btn btn-primary">
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Profile</h1>
          <p className="page-subtitle">Manage your account settings and preferences</p>
        </div>
        <div className="page-actions">
          <button 
            className={`btn ${editing ? 'btn-secondary' : 'btn-primary'}`}
            onClick={() => setEditing(!editing)}
          >
            <Edit size={20} />
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>

      <div className="profile-content">
        {/* Profile Overview Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="profile-overview-card"
        >
          <div className="profile-header">
            <div className="profile-avatar-section">
              <div className="profile-avatar">
                {profile?.avatar ? (
                  <img src={profile.avatar} alt="Profile" className="avatar-image" />
                ) : (
                  <div className="avatar-placeholder">
                    <User size={48} />
                  </div>
                )}
              </div>
              <div className="profile-info">
                <h2 className="profile-name">{profile?.name || 'User Name'}</h2>
                <p className="profile-email">{profile?.email || 'user@example.com'}</p>
                <div className="profile-meta">
                  <span className="profile-role">
                    <Calendar size={14} />
                    Member since {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Recently'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Profile Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="profile-form-card"
        >
          <div className="card-header">
            <h3 className="card-title">Personal Information</h3>
            <Settings size={20} />
          </div>
          
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <User size={16} />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  disabled={!editing}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  <Mail size={16} />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  disabled={!editing}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">
                <User size={16} />
                Avatar URL
              </label>
              <input
                type="url"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                className="form-input"
                disabled={!editing}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
            
            {editing && (
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  <Save size={16} />
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </motion.div>

      </div>
    </div>
  );
};

export default Profile;
