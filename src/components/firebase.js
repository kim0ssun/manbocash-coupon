import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyBbYjZBfxOBX2ay6jTpN9dCw0PXJ4e1rQ4",
    authDomain: "manbocash-7aa7e.firebaseapp.com",
    databaseURL: "https://manbocash-7aa7e.firebaseio.com",
    projectId: "manbocash-7aa7e",
    storageBucket: "manbocash-7aa7e.appspot.com",
    messagingSenderId: "387864702922",
    appId: "1:387864702922:web:04ab97e7a54b1807"
  };
  
  firebase.initializeApp(config);

  export default firebase;
  