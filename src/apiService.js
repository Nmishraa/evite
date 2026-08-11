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
  }
};
