import React, { useState } from 'react';
import { Calendar, MapPin, Clock, CheckCircle2, User, HelpCircle, XCircle, Gift, ExternalLink, MessageSquare } from 'lucide-react';
import CommentBoard from './CommentBoard';
import PaymentWidget from './PaymentWidget';
import './GuestView.css';

const GuestView = ({ event, onRSVP, currentUser, template, onAddComment }) => {
  const [nameInput, setNameInput] = useState(currentUser.name || '');
  const [status, setStatus] = useState('pending'); // 'yes', 'no', 'maybe'

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nameInput.trim() && status !== 'pending') {
      onRSVP(status, nameInput.trim());
    }
  };

  return (
    <div className="guest-view animate-fade-in" style={{ animationDelay: '0.2s', '--accent': template.primaryColor }}>
      <div className="invite-card glass-card">
        <div className="template-banner" style={{ backgroundImage: `url(${template.image})` }}>
          <div className="banner-overlay"></div>
        </div>
        <div className="event-hero">
          <h1 className="heading-xl">{event.title}</h1>
          <p className="hosted-by">Hosted by <span>{event.host}</span></p>
        </div>

        <div className="event-details">
          <div className="detail-item">
            <div className="icon-wrapper primary"><Calendar size={20} /></div>
            <div>
              <h3>Date</h3>
              <p>{event.date}</p>
            </div>
          </div>
          <div className="detail-item">
            <div className="icon-wrapper secondary"><Clock size={20} /></div>
            <div>
              <h3>Time</h3>
              <p>{event.time}</p>
            </div>
          </div>
          <div className="detail-item">
            <div className="icon-wrapper warning"><MapPin size={20} /></div>
            <div>
              <h3>Location</h3>
              <p>{event.location}</p>
            </div>
          </div>
        </div>

        <div className="event-description">
          <p>{event.description}</p>
        </div>

        {(event.showGiftRegistry === true || event.showGiftRegistry === 'true') && (
          <PaymentWidget 
            title="Gift Registry & Contributions (Optional)" 
            description="Your presence is enough, but if you'd like to give..." 
            paymentLinks={event.paymentLinks || {}}
          />
        )}

        {currentUser.isRegistered ? (
          <div className="rsvp-success animate-fade-in">
            <div className="success-icon">
              <CheckCircle2 size={48} />
            </div>
            <h2>RSVP Confirmed!</h2>
            <p>Thanks for letting us know, {currentUser.name}. We have saved your response.</p>
            <button className="btn btn-outline" onClick={() => onRSVP('pending', '')}>
              Update RSVP
            </button>
          </div>
        ) : (
          <form className="rsvp-form" onSubmit={handleSubmit}>
            <h2>Will you be joining us?</h2>
            
            <div className="input-group">
              <label htmlFor="guest_name">Your Name</label>
              <div className="input-with-icon">
                <User size={18} />
                <input 
                  type="text" 
                  id="guest_name"
                  placeholder="Enter your full name" 
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="rsvp-options">
              <button 
                type="button" 
                className={`rsvp-btn ${status === 'yes' ? 'selected yes' : ''}`}
                onClick={() => setStatus('yes')}
              >
                <CheckCircle2 size={20} />
                Yes, I'm in
              </button>
              <button 
                type="button" 
                className={`rsvp-btn ${status === 'maybe' ? 'selected maybe' : ''}`}
                onClick={() => setStatus('maybe')}
              >
                <HelpCircle size={20} />
                Maybe
              </button>
              <button 
                type="button" 
                className={`rsvp-btn ${status === 'no' ? 'selected no' : ''}`}
                onClick={() => setStatus('no')}
              >
                <XCircle size={20} />
                Can't make it
              </button>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary submit-rsvp"
              disabled={!nameInput.trim() || status === 'pending'}
            >
              Send RSVP
            </button>
          </form>
        )}

        <CommentBoard 
          eventId={event.id}
          comments={event.comments || []}
          onAddComment={onAddComment}
          currentUser={currentUser}
        />
      </div>
    </div>
  );
};

export default GuestView;
