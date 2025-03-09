import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA5N2icFbrrGgRkQD80Dj8jwg7I7u8ner0",
  authDomain: "quechuaapp-87797.firebaseapp.com",
  projectId: "quechuaapp-87797",
  storageBucket: "quechuaapp-87797.appspot.com",
  messagingSenderId: "1024003542254",
  appId: "1:1024003542254:web:a845bcfe4241fd6285f7ff"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };