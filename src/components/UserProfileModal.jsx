import React, { useState } from 'react';
import { X, User, Camera, Save, Mail, Calendar } from 'lucide-react';
import './UserProfileModal.css';

const UserProfileModal = ({ user, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: user.displayName || user.name || '',
    email: user.email || '',
    bio: user.bio || 'I love hosting amazing events!',
    location: user.location || 'New York, NY'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card glass-card animate-scale-in">
        <div className="modal-header">
          <h2>Edit Your Profile</h2>
          <button className="btn-icon" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="profile-hero">
          <div className="large-avatar">
            <User size={48} />
            <button className="btn-icon edit-avatar-btn"><Camera size={16} /></button>
          </div>
          <h3>{formData.name}</h3>
          <p className="text-muted">Member since April 2026</p>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="input-group">
            <label>Display Name</label>
            <div className="input-with-icon">
              <User size={18} />
              <input 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="How you appear to others"
              />
            </div>
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} />
              <input 
                name="email"
                value={formData.email}
                readOnly
                className="input-disabled"
              />
            </div>
          </div>

          <div className="input-group">
            <label>Bio</label>
            <textarea 
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              placeholder="Tell us a bit about yourself"
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <Save size={18} />
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfileModal;
