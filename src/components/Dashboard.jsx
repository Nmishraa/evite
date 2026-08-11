import React, { useState } from 'react';
import { Users, CheckCircle2, XCircle, HelpCircle, Clock, Edit3, Share2, Copy, DollarSign } from 'lucide-react';
import EditEventModal from './EditEventModal';
import GuestManager from './GuestManager';
import './Dashboard.css';

const Dashboard = ({ event, guests, onUpdateEvent, onAddGuest, onRemoveGuest, onSendInvite }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPaymentSettings, setShowPaymentSettings] = useState(false);
  const paymentLinks = event?.paymentLinks || { venmo: '', cashapp: '', paypal: '' };

  const handleUpdatePayment = (key, value) => {
    onUpdateEvent({ 
      paymentLinks: { ...paymentLinks, [key]: value } 
    });
  };

  const getStats = () => {
    return guests.reduce(
      (acc, guest) => {
        const status = guest.status || 'pending';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      { yes: 0, no: 0, maybe: 0, pending: 0 }
    );
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/invite/${event.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stats = getStats();
  const totalGuests = guests.length;
  const attendanceRate = totalGuests > 0 ? Math.round((stats.yes / totalGuests) * 100) : 0;

  return (
    <div className="dashboard-container animate-fade-in" style={{ animationDelay: '0.2s' }}>
      <div className="dashboard-header">
        <div>
          <h1 className="heading-lg">Host Dashboard</h1>
          <p className="text-muted">Real-time RSVP tracking for {event.title}</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={() => setIsEditing(true)}>
            <Edit3 size={18} />
            Edit Event
          </button>
          <div className="quick-stat glass">
            <Users size={20} className="text-primary" />
            <span>{totalGuests} Total Invited</span>
          </div>
        </div>
      </div>

      <div className="share-banner glass-card">
        <div className="share-info">
          <Share2 className="text-primary" />
          <div>
            <h3>Your invitation link is ready!</h3>
            <p className="text-muted">Share this link with your friends to start collecting RSVPs</p>
          </div>
        </div>
        <div className="share-box">
          <input 
            type="text" 
            readOnly 
            value={`${window.location.origin}/invite/${event.id}`} 
          />
          <button className={`btn ${copied ? 'btn-success' : 'btn-primary'}`} onClick={copyLink}>
            {copied ? 'Copied!' : <Copy size={18} />}
          </button>
        </div>
      </div>

      {isEditing && (
        <EditEventModal 
          event={event} 
          onSave={(data) => {
            onUpdateEvent(data);
            setIsEditing(false);
          }}
          onClose={() => setIsEditing(false)}
        />
      )}

      <div className="dashboard-grid">
        <div className="main-stats">
          <div className="stats-grid">
            <div className="stat-card glass-card success">
              <div className="stat-icon"><CheckCircle2 /></div>
              <div className="stat-info">
                <h3>Attending</h3>
                <p className="stat-number">{stats.yes}</p>
              </div>
            </div>
            <div className="stat-card glass-card warning">
              <div className="stat-icon"><HelpCircle /></div>
              <div className="stat-info">
                <h3>Maybe</h3>
                <p className="stat-number">{stats.maybe}</p>
              </div>
            </div>
            <div className="stat-card glass-card danger">
              <div className="stat-icon"><XCircle /></div>
              <div className="stat-info">
                <h3>Not Attending</h3>
                <p className="stat-number">{stats.no}</p>
              </div>
            </div>
          </div>

          <div className="attendance-progress-container glass-card">
            <div className="progress-header">
              <h3>Response Rate</h3>
              <span>{attendanceRate}% Accepted</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${attendanceRate}%` }}></div>
            </div>
          </div>

          <GuestManager 
            guests={guests} 
            onAddGuest={onAddGuest}
            onRemoveGuest={onRemoveGuest}
            onSendInvite={onSendInvite}
          />

          <div className="payment-settings-card glass-card" style={{ marginTop: '24px' }}>
            <div className="list-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <DollarSign size={20} className="text-secondary" />
                <h3>Gift Registry & Contributions</h3>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 'bold' }}>
                <input 
                  type="checkbox"
                  checked={Boolean(event.showGiftRegistry)}
                  onChange={(e) => onUpdateEvent({ showGiftRegistry: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary-color)' }}
                />
                {event.showGiftRegistry ? 'Enabled' : 'Disabled (Optional)'}
              </label>
            </div>
            
            {event.showGiftRegistry && (
              <div className="payment-config-form animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                <p className="text-muted text-sm">Configure optional payment tags so guests can contribute gifts directly.</p>
                <div className="input-group">
                  <label>Venmo Username (e.g., @john-doe)</label>
                  <input 
                    type="text" 
                    value={paymentLinks.venmo} 
                    onChange={(e) => handleUpdatePayment('venmo', e.target.value)}
                    placeholder="@username"
                    className="form-input"
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                  />
                </div>
                <div className="input-group">
                  <label>CashApp Cashtag (e.g., $JohnDoe)</label>
                  <input 
                    type="text" 
                    value={paymentLinks.cashapp} 
                    onChange={(e) => handleUpdatePayment('cashapp', e.target.value)}
                    placeholder="$cashtag"
                    className="form-input"
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                  />
                </div>
                <div className="input-group">
                  <label>PayPal Handle (e.g., paypal.me/johndoe)</label>
                  <input 
                    type="text" 
                    value={paymentLinks.paypal} 
                    onChange={(e) => handleUpdatePayment('paypal', e.target.value)}
                    placeholder="paypal.me/username"
                    className="form-input"
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="guest-list-card glass-card">
          <div className="list-header">
            <h3>RSVP Status</h3>
            <span className="badge">{totalGuests} Guests</span>
          </div>

          <div className="guest-list">
            {guests.length === 0 ? (
              <div className="empty-state">
                <Users size={48} />
                <p>No RSVPs yet.</p>
              </div>
            ) : (
              guests.map(guest => (
                <div key={guest.id} className="guest-item hover:bg-surface-hover">
                  <div className="guest-info">
                    <div className="avatar">{guest.name.charAt(0).toUpperCase()}</div>
                    <span className="guest-name">{guest.name}</span>
                  </div>
                  <div className={`status-badge status-${guest.status || 'pending'}`}>
                    {(guest.status || 'pending').charAt(0).toUpperCase() + (guest.status || 'pending').slice(1)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
