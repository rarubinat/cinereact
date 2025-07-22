import firebase from 'firebase/app';
import 'firebase/firestore';
import "firebase/auth";

// Configura la información de tu proyecto de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBwPB7Qn0gNRWBvK0RCOQr67MFwepOmJNk",
    authDomain: "cinereact-380f3.firebaseapp.com",
    projectId: "cinereact-380f3",
    storageBucket: "cinereact-380f3.appspot.com",
    messagingSenderId: "165670784302",
    appId: "1:165670784302:web:c1fd938e33ff2c29f83ebf",
    measurementId: "G-TJT59BRTMY"
};

// Inicializa Firebase solo una vez
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Obtén una referencia a la base de datos de Firestore
const db = firebase.firestore();
const auth = firebase.auth();

export { auth };      // named export
export default db;    // default export