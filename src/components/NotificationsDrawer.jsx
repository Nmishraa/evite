import React from 'react';
import { Bell, X, Check, MessageSquare, UserPlus } from 'lucide-react';
import './NotificationsDrawer.css';

const NotificationsDrawer = ({ notifications, onClose, onMarkAsRead }) => {
  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-content glass-card animate-slide-left" onClick={e => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="flex items-center gap-2">
            <Bell size={20} />
            <h2>Notifications</h2>
          </div>
          <button className="btn-icon" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="notifications-list">
          {notifications.length === 0 ? (
            <div className="empty-notifications">
              <Bell size={48} className="text-muted" />
              <p>All caught up!</p>
            </div>
          ) : (
            notifications.map(notif => (
              <div key={notif.id} className={`notification-item ${notif.read ? 'read' : ''}`}>
                <div className={`notif-icon ${notif.type}`}>
                  {notif.type === 'rsvp' && <UserPlus size={16} />}
                  {notif.type === 'comment' && <MessageSquare size={16} />}
                </div>
                <div className="notif-body">
                  <p className="notif-text">{notif.text}</p>
                  <span className="notif-time">{notif.time}</span>
                </div>
                {!notif.read && (
                  <button className="btn-icon read-btn" onClick={() => onMarkAsRead(notif.id)}>
                    <Check size={14} />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsDrawer;
