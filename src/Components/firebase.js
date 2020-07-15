import firebase from 'firebase/app';
import "firebase/firestore"
import "@firebase/auth";

// eslint-disable-next-line
const app = firebase.initializeApp({
    apiKey: "AIzaSyCSB1oX8X2HAghK7kOyktlQRFerEqJyO-4",
    authDomain: "note-nf.firebaseapp.com",
    databaseURL: "https://note-nf.firebaseio.com",
    projectId: "note-nf",
    storageBucket: "note-nf.appspot.com",
    messagingSenderId: "156058526501",
    appId: "1:156058526501:web:aabf6fc7a1e2d2a95030cc",
    measurementId: "G-QVLHX5G3QX"
});

export default firebase


