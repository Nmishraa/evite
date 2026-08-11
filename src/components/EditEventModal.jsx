import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, FileText, User, Save } from 'lucide-react';
import './EditEventModal.css';

const EditEventModal = ({ event, onSave, onClose }) => {
  const [formData, setFormData] = useState({ ...event });

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
      <div className="modal-card glass-card animate-fade-in">
        <div className="modal-header">
          <h2>Edit Event Details</h2>
          <button className="btn-icon" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="edit-form">
          <div className="input-group">
            <label>Event Title</label>
            <div className="input-with-icon">
              <FileText size={18} />
              <input 
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Event Title"
                required
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="input-group">
              <label>Date</label>
              <div className="input-with-icon">
                <Calendar size={18} />
                <input 
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  placeholder="e.g. July 15, 2026"
                  required
                />
              </div>
            </div>
            <div className="input-group">
              <label>Time</label>
              <div className="input-with-icon">
                <Clock size={18} />
                <input 
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  placeholder="e.g. 8:00 PM"
                  required
                />
              </div>
            </div>
          </div>

          <div className="input-group">
            <label>Location</label>
            <div className="input-with-icon">
              <MapPin size={18} />
              <input 
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Venue or Address"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Host Name</label>
            <div className="input-with-icon">
              <User size={18} />
              <input 
                name="host"
                value={formData.host}
                onChange={handleChange}
                placeholder="Host Name"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Description</label>
            <textarea 
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              placeholder="Tell your guests about the event..."
              rows={4}
              className="glass-input"
            />
          </div>

          <div className="input-group gift-registry-toggle-group" style={{ marginTop: '16px', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 'bold' }}>
              <input 
                type="checkbox"
                name="showGiftRegistry"
                checked={formData.showGiftRegistry || false}
                onChange={(e) => setFormData(prev => ({ ...prev, showGiftRegistry: e.target.checked }))}
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary-color)' }}
              />
              Enable Gift Registry & Contributions (Optional)
            </label>

            {formData.showGiftRegistry && (
              <div className="gift-registry-inputs animate-fade-in" style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="input-group">
                  <label style={{ fontSize: '0.85rem' }}>Venmo Handle (Optional)</label>
                  <input 
                    type="text" 
                    value={formData.paymentLinks?.venmo || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      paymentLinks: { ...(prev.paymentLinks || {}), venmo: e.target.value } 
                    }))}
                    placeholder="@YourVenmoHandle"
                    className="glass-input"
                  />
                </div>
                <div className="input-group">
                  <label style={{ fontSize: '0.85rem' }}>PayPal Link / Username (Optional)</label>
                  <input 
                    type="text" 
                    value={formData.paymentLinks?.paypal || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      paymentLinks: { ...(prev.paymentLinks || {}), paypal: e.target.value } 
                    }))}
                    placeholder="paypal.me/yourname"
                    className="glass-input"
                  />
                </div>
                <div className="input-group">
                  <label style={{ fontSize: '0.85rem' }}>CashApp Tag (Optional)</label>
                  <input 
                    type="text" 
                    value={formData.paymentLinks?.cashapp || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      paymentLinks: { ...(prev.paymentLinks || {}), cashapp: e.target.value } 
                    }))}
                    placeholder="$YourCashTag"
                    className="glass-input"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <Save size={18} />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventModal;
