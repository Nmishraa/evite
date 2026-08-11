# Evite - Digital Invitation & Event Management Platform

A modern, responsive digital invitation and event management web application built with React, Vite, and Firebase.

## 🚀 Features

- **Event Dashboard**: Manage upcoming and past events.
- **Guest Management**: Track RSVPs, guest lists, and status updates.
- **Custom Digital Invitations**: Beautiful invitation templates with custom theme styling.
- **Interactive Comments & Feedback**: Real-time comment board for guests.
- **Notifications & Profile Management**: Real-time notifications and user profile customization.

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Modern CSS3 (Glassmorphism, CSS Variables, Animations)
- **Backend / Database**: Firebase Auth & Firestore

## 📁 Project Structure

```
evite/
├── public/              # Static assets (favicons, icons)
├── src/
│   ├── assets/          # Images and SVG assets
│   ├── components/      # Modular UI Components (Auth, Dashboard, GuestManager, etc.)
│   ├── firebase.js      # Firebase configuration & initialization
│   ├── firebaseService.js # Firestore database helpers
│   ├── App.jsx          # Root application component
│   └── main.jsx         # Entry point
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
└── vite.config.js       # Vite configuration
```

## ⚙️ Getting Started

### 1. Clone the repository
```bash
git clone <your-repository-url>
cd evite
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Firebase
Update `src/firebase.js` with your Firebase API credentials:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 4. Run Development Server
```bash
npm run dev
```

### 5. Build for Production
```bash
npm run build
```

