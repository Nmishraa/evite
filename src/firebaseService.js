import { auth, db } from './firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInAnonymously,
  signOut,
  onAuthStateChanged 
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  onSnapshot 
} from "firebase/firestore";

export const firebaseService = {
  // Auth
  signUp: (email, password) => createUserWithEmailAndPassword(auth, email, password),
  signIn: (email, password) => signInWithEmailAndPassword(auth, email, password),
  signInGuest: () => signInAnonymously(auth),
  logout: async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn("Firebase signout failed", err);
      throw err; // Re-throw so catch in App.jsx can handle it
    }
  },
  subscribeToAuth: (callback) => onAuthStateChanged(auth, callback),

  // Firestore
  saveEvent: async (eventId, eventData) => {
    const docRef = doc(db, "events", eventId);
    await setDoc(docRef, eventData, { merge: true });
  },

  getEvent: async (eventId) => {
    const docRef = doc(db, "events", eventId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  },

  subscribeToEvent: (eventId, callback) => {
    return onSnapshot(doc(db, "events", eventId), (doc) => {
      if (doc.exists()) callback(doc.data());
    });
  },

  updateRSVP: async (eventId, guestData) => {
    const eventRef = doc(db, "events", eventId);
    const eventSnap = await getDoc(eventRef);
    if (!eventSnap.exists()) return;

    const currentGuests = eventSnap.data().guests || [];
    const existingIndex = currentGuests.findIndex(g => g.name.toLowerCase() === guestData.name.toLowerCase());
    
    let newGuests;
    if (existingIndex >= 0) {
      newGuests = [...currentGuests];
      newGuests[existingIndex] = { ...newGuests[existingIndex], ...guestData };
    } else {
      newGuests = [...currentGuests, { id: Date.now(), ...guestData }];
    }

    await updateDoc(eventRef, { guests: newGuests });
  },

  removeGuest: async (eventId, guestId) => {
    const eventRef = doc(db, "events", eventId);
    const eventSnap = await getDoc(eventRef);
    if (!eventSnap.exists()) return;

    const currentGuests = eventSnap.data().guests || [];
    const newGuests = currentGuests.filter(g => g.id !== guestId);
    await updateDoc(eventRef, { guests: newGuests });
  },

  addComment: async (eventId, comment) => {
    const eventRef = doc(db, "events", eventId);
    const eventSnap = await getDoc(eventRef);
    if (!eventSnap.exists()) return;

    const currentComments = eventSnap.data().comments || [];
    await updateDoc(eventRef, { 
      comments: [...currentComments, { ...comment, id: Date.now() }] 
    });
  },

  deleteEvent: async (eventId) => {
    // In a real multi-event app, we would delete the doc.
    // For this prototype, we'll just reset it to blank/null 
    // to simulate deletion since we only have one main event ID.
    const eventRef = doc(db, "events", eventId);
    await setDoc(eventRef, { deleted: true });
  }
};
