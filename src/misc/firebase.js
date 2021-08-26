import firebase from 'firebase/app';

const config = {
  apiKey: 'AIzaSyDwPLbNHPLZrR4Obw-dURqdNk3V_mTpffc',
  authDomain: 'chat-web-app-8dd66.firebaseapp.com',
  databaseURL:
    'https://chat-web-app-8dd66-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'chat-web-app-8dd66',
  storageBucket: 'chat-web-app-8dd66.appspot.com',
  messagingSenderId: '1059274237789',
  appId: '1:1059274237789:web:af6b21a047fdb19a2f2ab4',
};

const app = firebase.initializeApp(config);
