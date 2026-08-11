import React from 'react';
import { Sparkles, LogOut, Bell, ChevronLeft } from 'lucide-react';
import './Header.css';

const Header = ({ user, onLogout, showBack, onBack, onOpenProfile, onOpenNotifications, unreadCount }) => {
  return (
    <header className="app-header">
      <div className="header-left">
        {showBack && (
          <button className="btn-icon back-btn" onClick={onBack} title="Go Back">
            <ChevronLeft size={20} />
          </button>
        )}
        <div className="logo" onClick={onBack} style={{ cursor: showBack ? 'pointer' : 'default' }}>
          <Sparkles className="text-primary" />
          <span>EvitePro</span>
        </div>
      </div>

      <div className="header-right">
        <button className="btn-icon notif-btn" onClick={onOpenNotifications}>
          <Bell size={20} />
          {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
        </button>

        <div className="user-profile" onClick={onOpenProfile} style={{ cursor: 'pointer' }}>
          <div className="user-info">
            <span className="text-muted">Welcome,</span>
            <span className="user-name">{user.displayName || user.email || user.name}</span>
          </div>
        </div>

        <button className="btn btn-outline signout-btn" onClick={onLogout}>
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </header>
  );
};

export default Header;
