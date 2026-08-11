import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import Header from './components/Header';
import HomeDashboard from './components/HomeDashboard';
import Dashboard from './components/Dashboard';
import GuestView from './components/GuestView';
import TemplateGallery, { TEMPLATES } from './components/TemplateGallery';
import Auth from './components/Auth';
import UserProfileModal from './components/UserProfileModal';
import NotificationsDrawer from './components/NotificationsDrawer';
import { firebaseService } from './firebaseService';
import './App.css';

const DEFAULT_EVENT_ID = 'main-event-2026';

const INITIAL_EVENT_DATA = {
  id: DEFAULT_EVENT_ID,
  title: 'My Special Event',
  date: 'Saturday, July 15, 2026',
  time: '8:00 PM',
  location: 'Skyline Terrace, NY',
  host: 'Alex & Jordan',
  description: 'Join us for an amazing night under the stars with great food, drinks, and music!',
  guests: [
    { id: 1, name: 'Sam Smith', status: 'yes' },
    { id: 2, name: 'Taylor Doe', status: 'no' },
    { id: 3, name: 'Casey Lee', status: 'maybe' },
  ],
  comments: [],
  templateId: 'birthday',
  showGiftRegistry: false,
  paymentLinks: {
    venmo: '',
    cashapp: '',
    paypal: ''
  }
};

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState('home'); 
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [eventData, setEventData] = useState(INITIAL_EVENT_DATA);
  const [currentUser, setCurrentUser] = useState({ name: '', isRegistered: false });
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'rsvp', text: 'Sam Smith RSVPed Yes to your event', time: '2h ago', read: false },
    { id: 2, type: 'comment', text: 'New comment on your event board', time: '5h ago', read: true }
  ]);

  // Handle Auth State
  useEffect(() => {
    return firebaseService.subscribeToAuth((user) => {
      setUser(user);
      setAuthLoading(false);
      if (user) setCurrentScreen('home');
    });
  }, []);

  // Handle Realtime Event Data
  useEffect(() => {
    if (!user) return;
    return firebaseService.subscribeToEvent(DEFAULT_EVENT_ID, (data) => {
      setEventData(data);
      if (data.templateId) {
        const template = TEMPLATES.find(t => t.id === data.templateId);
        if (template) setSelectedTemplate(template);
      }
    });
  }, [user]);

  const handleLogin = async (credentials) => {
    try {
      if (credentials.isGuest) {
        await firebaseService.signInGuest();
      } else {
        const { email, password } = credentials;
        try {
          await firebaseService.signIn(email, password);
        } catch (err) {
          await firebaseService.signUp(email, password);
        }
      }
      setCurrentScreen('home');
    } catch (err) {
      console.error("Auth error", err);
      setUser({ ...credentials, name: credentials.name || 'Guest' });
      setCurrentScreen('home');
    }
  };

  const handleLogout = async () => {
    try {
      await firebaseService.logout();
    } catch (err) {
      console.warn("Logout failed", err);
    }
    setUser(null);
    setSelectedTemplate(null);
    setCurrentScreen('home');
  };

  const handleRSVP = async (status, name) => {
    if (!name) return;
    try {
      await firebaseService.updateRSVP(DEFAULT_EVENT_ID, { name, status });
      setCurrentUser({ name, isRegistered: true });
    } catch (err) {
      console.error("RSVP error", err);
    }
  };

  const handleTemplateSelect = async (template) => {
    const updatedData = {
      ...eventData,
      templateId: template.id,
      title: template.id === 'temple' ? 'Temple Visit & Blessing' : 
             template.id === 'birthday' ? 'Birthday Celebration' :
             template.id === 'wedding' ? 'Wedding Ceremony' : 
             template.id === 'graduation' ? 'Graduation Commencement' : 'Dinner Party'
    };
    setSelectedTemplate(template);
    setEventData(updatedData);
    setCurrentScreen('preview');
    
    try {
      await firebaseService.saveEvent(DEFAULT_EVENT_ID, updatedData);
    } catch (err) {}
  };

  const handleUpdateEvent = async (updatedFields) => {
    const newData = { ...eventData, ...updatedFields };
    setEventData(newData);
    try {
      await firebaseService.saveEvent(DEFAULT_EVENT_ID, newData);
    } catch (err) {
      console.error("Update error", err);
    }
  };

  const handleAddGuest = async (guest) => {
    try {
      await firebaseService.updateRSVP(DEFAULT_EVENT_ID, { ...guest, status: 'pending' });
    } catch (err) {}
  };

  const handleRemoveGuest = async (guestId) => {
    try {
      await firebaseService.removeGuest(DEFAULT_EVENT_ID, guestId);
    } catch (err) {}
  };

  const handleAddComment = async (text) => {
    const newComment = {
      author: user?.displayName || user?.name || currentUser.name || 'Guest',
      text,
      time: 'Just now'
    };
    try {
      await firebaseService.addComment(DEFAULT_EVENT_ID, newComment);
    } catch (err) {}
  };

  const handleSendInvite = (guest) => {
    console.log(`Sending ${guest.type} to ${guest.contact}`);
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await firebaseService.deleteEvent(eventId);
      setEventData(null); // Clear local state
    } catch (err) {}
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (authLoading) {
    return (
      <div className="loading-screen">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  const eventsList = eventData && !eventData.deleted ? [eventData] : [];

  return (
    <div className="app-container" style={{ '--event-theme': selectedTemplate?.primaryColor || 'var(--primary)' }}>
      <Header 
        user={user} 
        onLogout={handleLogout} 
        showBack={currentScreen !== 'home'} 
        onBack={() => setCurrentScreen('home')} 
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        unreadCount={unreadCount}
      />

      <main>
        {currentScreen === 'home' && (
          <HomeDashboard 
            events={eventsList} 
            onCreateNew={() => setCurrentScreen('gallery')}
            onManageEvent={() => setCurrentScreen('manage')}
            onDeleteEvent={handleDeleteEvent}
          />
        )}

        {currentScreen === 'gallery' && (
          <TemplateGallery onSelect={handleTemplateSelect} />
        )}

        {currentScreen === 'manage' && (
          <Dashboard 
            event={eventData} 
            guests={eventData.guests || []} 
            onUpdateEvent={handleUpdateEvent}
            onAddGuest={handleAddGuest}
            onRemoveGuest={handleRemoveGuest}
            onSendInvite={(g) => console.log('Invite:', g)}
          />
        )}

        {currentScreen === 'preview' && (
          <div className="preview-mode">
            <div className="view-toggle mb-8">
              <button className="active">Preview Invite</button>
              <button onClick={() => setCurrentScreen('manage')}>Host Dashboard</button>
            </div>
            <GuestView 
              event={eventData} 
              template={selectedTemplate}
              onRSVP={handleRSVP} 
              currentUser={currentUser}
              onAddComment={handleAddComment}
            />
          </div>
        )}
      </main>

      {isProfileOpen && (
        <UserProfileModal 
          user={user} 
          onSave={(data) => {
            setUser({...user, ...data});
            setIsProfileOpen(false);
          }}
          onClose={() => setIsProfileOpen(false)}
        />
      )}

      {isNotificationsOpen && (
        <NotificationsDrawer 
          notifications={notifications}
          onClose={() => setIsNotificationsOpen(false)}
          onMarkAsRead={(id) => setNotifications(prev => prev.map(n => n.id === id ? {...n, read: true} : n))}
        />
      )}
    </div>
  );
}

export default App;
