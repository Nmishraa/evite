import React from 'react';
import { Plus, Calendar, Clock, MapPin, ChevronRight, Layout, Trash2 } from 'lucide-react';
import './HomeDashboard.css';

const HomeDashboard = ({ events, onCreateNew, onManageEvent, onDeleteEvent }) => {
  return (
    <div className="home-dashboard animate-fade-in">
      <div className="home-header">
        <h1 className="heading-xl">Your Events</h1>
        <button className="btn btn-primary create-btn" onClick={onCreateNew}>
          <Plus size={20} />
          Create New Invitation
        </button>
      </div>

      {events.length === 0 ? (
        <div className="empty-events glass-card">
          <Layout size={64} className="text-muted" />
          <h2>No events yet</h2>
          <p className="text-muted">Start by creating your first beautiful invitation</p>
          <button className="btn btn-primary" onClick={onCreateNew}>Get Started</button>
        </div>
      ) : (
        <div className="event-list">
          {events.map(event => (
            <div key={event.id} className="event-thumb-card glass-card" onClick={() => onManageEvent(event)}>
              <div className="event-info-main">
                <div className="event-title-row">
                  <h3>{event.title}</h3>
                  <span className="status-indicator">Active</span>
                </div>
                <div className="event-details-row">
                  <span><Calendar size={14} /> {event.date}</span>
                  <span><Clock size={14} /> {event.time}</span>
                  <span><MapPin size={14} /> {event.location}</span>
                </div>
              </div>
              <div className="guest-pill">
                {event.guests?.length || 0} Guests
              </div>
              <button 
                className="btn-icon delete-event-btn" 
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm('Are you sure you want to delete this event?')) {
                    onDeleteEvent(event.id);
                  }
                }}
              >
                <Trash2 size={18} className="text-danger" />
              </button>
              <ChevronRight size={24} className="text-muted" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomeDashboard;
