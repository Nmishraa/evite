import React, { useState } from 'react';
import { UserPlus, Mail, Phone, Send, Trash2, CheckCircle2 } from 'lucide-react';
import './GuestManager.css';

const GuestManager = ({ guests, onAddGuest, onRemoveGuest, onSendInvite }) => {
  const [newGuest, setNewGuest] = useState({ name: '', contact: '', type: 'email' });
  const [status, setStatus] = useState({}); // { id: 'sending' | 'sent' }

  const handleAdd = (e) => {
    e.preventDefault();
    if (newGuest.name && newGuest.contact) {
      onAddGuest(newGuest);
      setNewGuest({ name: '', contact: '', type: 'email' });
    }
  };

  const handleSend = (guest) => {
    setStatus(prev => ({ ...prev, [guest.id]: 'sending' }));
    setTimeout(() => {
      onSendInvite(guest);
      setStatus(prev => ({ ...prev, [guest.id]: 'sent' }));
    }, 1500);
  };

  return (
    <div className="guest-manager glass-card animate-fade-in">
      <div className="manager-header">
        <h3>Manage & Send Invitations</h3>
        <p className="text-muted">Add your guests and notify them via Email or Text</p>
      </div>

      <form onSubmit={handleAdd} className="add-guest-form">
        <div className="input-group">
          <input 
            type="text" 
            placeholder="Guest Name" 
            value={newGuest.name}
            onChange={(e) => setNewGuest({...newGuest, name: e.target.value})}
            required
          />
        </div>
        <div className="input-group">
          <div className="contact-input">
            <select 
              value={newGuest.type}
              onChange={(e) => setNewGuest({...newGuest, type: e.target.value})}
            >
              <option value="email">Email</option>
              <option value="phone">Text</option>
            </select>
            <input 
              type={newGuest.type === 'email' ? 'email' : 'tel'} 
              placeholder={newGuest.type === 'email' ? 'email@example.com' : '+1 234 567 890'} 
              value={newGuest.contact}
              onChange={(e) => setNewGuest({...newGuest, contact: e.target.value})}
              required
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          <UserPlus size={18} />
          Add Guest
        </button>
      </form>

      <div className="guest-registry">
        {guests.length === 0 ? (
          <div className="empty-registry">
            <Mail size={40} className="text-muted" />
            <p>Your guest list is empty. Add your first guest above!</p>
          </div>
        ) : (
          <div className="guest-table">
            {guests.map(guest => (
              <div key={guest.id} className="registry-item">
                <div className="guest-brief">
                  <div className="guest-initial">{guest.name.charAt(0)}</div>
                  <div>
                    <p className="guest-name">{guest.name}</p>
                    <p className="guest-contact text-muted">
                      {guest.type === 'email' ? <Mail size={12} /> : <Phone size={12} />}
                      {guest.contact || 'Manual Entry'}
                    </p>
                  </div>
                </div>

                <div className="guest-actions">
                  {status[guest.id] === 'sent' ? (
                    <span className="status-sent">
                      <CheckCircle2 size={16} /> Sent
                    </span>
                  ) : (
                    <button 
                      className={`btn btn-sm ${status[guest.id] === 'sending' ? 'btn-loading' : 'btn-outline'}`}
                      onClick={() => handleSend(guest)}
                      disabled={status[guest.id] === 'sending'}
                    >
                      <Send size={14} />
                      {status[guest.id] === 'sending' ? 'Sending...' : 'Send Invite'}
                    </button>
                  )}
                  <button className="btn-icon text-danger" onClick={() => onRemoveGuest(guest.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestManager;
