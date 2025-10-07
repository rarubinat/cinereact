// firebaseConfig.js
// This file sets up Firebase for the project, including Firestore and Authentication.

// Import Firebase core and the required services
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyBwPB7Qn0gNRWBvK0RCOQr67MFwepOmJNk",
    authDomain: "cinereact-380f3.firebaseapp.com",
    projectId: "cinereact-380f3",
    storageBucket: "cinereact-380f3.appspot.com",
    messagingSenderId: "165670784302",
    appId: "1:165670784302:web:c1fd938e33ff2c29f83ebf",
    measurementId: "G-TJT59BRTMY"
};

// Initialize Firebase app only if it hasn't been initialized yet
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Get Firestore database reference
const db = firebase.firestore();

// Get Firebase Authentication reference
const auth = firebase.auth();

// Export auth as a named export
export { auth };

// Export db as the default export
export default db;
