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
import { apiService } from './apiService';
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

  const [eventsList, setEventsList] = useState([INITIAL_EVENT_DATA]);

  // Load database events, guests, and comments on mount/login
  useEffect(() => {
    if (!user) return;

    // Fetch all events from PostgreSQL DB
    const fetchDbData = async () => {
      const dbEvents = await apiService.getEvents();
      if (dbEvents && dbEvents.length > 0) {
        setEventsList(dbEvents);
        setEventData(dbEvents[0]);
      } else {
        await apiService.saveEvent(INITIAL_EVENT_DATA);
        setEventsList([INITIAL_EVENT_DATA]);
      }

      const activeEventId = eventData?.id || DEFAULT_EVENT_ID;
      const dbGuests = await apiService.getGuests(activeEventId);
      const dbComments = await apiService.getComments(activeEventId);
      if (dbGuests && dbGuests.length > 0) {
        setEventData(prev => ({ ...prev, guests: dbGuests }));
      }
      if (dbComments && dbComments.length > 0) {
        setEventData(prev => ({ ...prev, comments: dbComments }));
      }
    };
    fetchDbData();

    return firebaseService.subscribeToEvent(DEFAULT_EVENT_ID, (data) => {
      setEventData(prev => ({ ...prev, ...data }));
      if (data.templateId) {
        const template = TEMPLATES.find(t => t.id === data.templateId);
        if (template) setSelectedTemplate(template);
      }
    });
  }, [user]);

  const handleLogin = async (credentials) => {
    try {
      // Save user to PostgreSQL database
      const dbUser = await apiService.loginUser(credentials);

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
      if (dbUser) {
        setUser({ ...credentials, ...dbUser });
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
      const activeId = eventData?.id || DEFAULT_EVENT_ID;
      const newGuest = { eventId: activeId, name, status };
      await apiService.saveGuest(newGuest);
      await firebaseService.updateRSVP(activeId, { name, status });
      
      // Update local state
      setEventData(prev => ({
        ...prev,
        guests: [...(prev.guests || []).filter(g => g.name !== name), { id: Date.now(), name, status }]
      }));
      setCurrentUser({ name, isRegistered: true });
    } catch (err) {
      console.error("RSVP error", err);
    }
  };

  const handleTemplateSelect = async (template) => {
    const newEventId = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newEvent = {
      id: newEventId,
      title: template.id === 'temple' ? 'Temple Visit & Blessing' : 
             template.id === 'birthday' ? 'Birthday Celebration' :
             template.id === 'wedding' ? 'Wedding Ceremony' : 
             template.id === 'graduation' ? 'Graduation Commencement' : 'Dinner Party',
      date: 'Saturday, July 15, 2026',
      time: '8:00 PM',
      location: 'Skyline Terrace, NY',
      host: user?.displayName || user?.name || 'Alex & Jordan',
      description: 'Join us for a wonderful event!',
      category: template.id,
      theme: template.id,
      templateId: template.id,
      showGiftRegistry: false,
      guests: [],
      comments: []
    };

    setSelectedTemplate(template);
    setEventData(newEvent);
    setEventsList(prev => [newEvent, ...prev]);
    setCurrentScreen('preview');
    
    try {
      await apiService.saveEvent(newEvent);
      await firebaseService.saveEvent(newEventId, newEvent);
    } catch (err) {
      console.error("Create event error", err);
    }
  };

  const handleUpdateEvent = async (updatedFields) => {
    const newData = { ...eventData, ...updatedFields };
    setEventData(newData);
    setEventsList(prev => prev.map(e => e.id === newData.id ? newData : e));
    try {
      await apiService.saveEvent(newData);
      await firebaseService.saveEvent(newData.id, newData);
    } catch (err) {
      console.error("Update error", err);
    }
  };

  const handleAddGuest = async (guest) => {
    try {
      const activeId = eventData?.id || DEFAULT_EVENT_ID;
      const guestPayload = {
        eventId: activeId,
        name: guest.name,
        email: guest.contact || guest.email || '',
        status: 'pending'
      };
      await apiService.saveGuest(guestPayload);
      await firebaseService.updateRSVP(activeId, { ...guest, status: 'pending' });

      setEventData(prev => ({
        ...prev,
        guests: [...(prev.guests || []), { id: Date.now(), ...guest, status: 'pending' }]
      }));
    } catch (err) {
      console.error("Add guest error", err);
    }
  };

  const handleRemoveGuest = async (guestId) => {
    try {
      const activeId = eventData?.id || DEFAULT_EVENT_ID;
      setEventData(prev => ({
        ...prev,
        guests: (prev.guests || []).filter(g => g.id !== guestId)
      }));
      await firebaseService.removeGuest(activeId, guestId);
    } catch (err) {}
  };

  const handleAddComment = async (text) => {
    const activeId = eventData?.id || DEFAULT_EVENT_ID;
    const authorName = user?.displayName || user?.name || currentUser.name || 'Guest';
    const newComment = {
      eventId: activeId,
      author: authorName,
      text,
      time: 'Just now'
    };
    try {
      await apiService.addComment(newComment);
      await firebaseService.addComment(activeId, newComment);

      setEventData(prev => ({
        ...prev,
        comments: [...(prev.comments || []), newComment]
      }));
    } catch (err) {
      console.error("Add comment error", err);
    }
  };

  const handleSendInvite = (guest) => {
    console.log(`Sending ${guest.type} to ${guest.contact}`);
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await apiService.deleteEvent(eventId);
      await firebaseService.deleteEvent(eventId);
      setEventsList(prev => prev.filter(e => e.id !== eventId));
      if (eventData?.id === eventId) {
        setEventData(null);
      }
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
