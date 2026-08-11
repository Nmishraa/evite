const API_BASE = 'http://localhost:5000/api';

export const apiService = {
  async loginUser(credentials) {
    try {
      const response = await fetch(`${API_BASE}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      if (!response.ok) throw new Error('Failed to log in to database');
      return await response.json();
    } catch (error) {
      console.warn('PostgreSQL API login warning:', error.message);
      return null;
    }
  },

  async getUsers() {
    try {
      const response = await fetch(`${API_BASE}/users`);
      if (!response.ok) throw new Error('Failed to fetch users');
      return await response.json();
    } catch (error) {
      console.warn('PostgreSQL API getUsers warning:', error.message);
      return [];
    }
  },

  async saveEvent(eventData) {
    try {
      const response = await fetch(`${API_BASE}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });
      if (!response.ok) throw new Error('Failed to save event');
      return await response.json();
    } catch (error) {
      console.warn('PostgreSQL API saveEvent warning:', error.message);
      return null;
    }
  },

  async getEvents() {
    try {
      const response = await fetch(`${API_BASE}/events`);
      if (!response.ok) throw new Error('Failed to fetch events');
      return await response.json();
    } catch (error) {
      console.warn('PostgreSQL API getEvents warning:', error.message);
      return [];
    }
  },

  async deleteEvent(eventId) {
    try {
      const response = await fetch(`${API_BASE}/events/${eventId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete event');
      return await response.json();
    } catch (error) {
      console.warn('PostgreSQL API deleteEvent warning:', error.message);
      return null;
    }
  },

  async saveGuest(guestData) {
    try {
      const payload = {
        id: guestData.id || `gst_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        eventId: guestData.eventId || 'main-event-2026',
        name: guestData.name,
        email: guestData.email || '',
        status: guestData.status || 'pending',
        plusOnes: guestData.plusOnes || 0
      };
      const response = await fetch(`${API_BASE}/guests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Failed to save guest');
      return await response.json();
    } catch (error) {
      console.warn('PostgreSQL API saveGuest warning:', error.message);
      return null;
    }
  },

  async getGuests(eventId = 'main-event-2026') {
    try {
      const response = await fetch(`${API_BASE}/events/${eventId}/guests`);
      if (!response.ok) throw new Error('Failed to fetch guests');
      return await response.json();
    } catch (error) {
      console.warn('PostgreSQL API getGuests warning:', error.message);
      return [];
    }
  },

  async addComment(commentData) {
    try {
      const payload = {
        id: commentData.id || `cmt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        eventId: commentData.eventId || 'main-event-2026',
        author: commentData.author || 'Guest',
        text: commentData.text
      };
      const response = await fetch(`${API_BASE}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Failed to add comment');
      return await response.json();
    } catch (error) {
      console.warn('PostgreSQL API addComment warning:', error.message);
      return null;
    }
  },

  async getComments(eventId = 'main-event-2026') {
    try {
      const response = await fetch(`${API_BASE}/events/${eventId}/comments`);
      if (!response.ok) throw new Error('Failed to fetch comments');
      return await response.json();
    } catch (error) {
      console.warn('PostgreSQL API getComments warning:', error.message);
      return [];
    }
  }
};
