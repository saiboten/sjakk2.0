import * as firebase from 'firebase';

const config = {
  apiKey: "AIzaSyBdvsddep5CAnAJVIGSgI3RvZfq5gji9Dw",
  authDomain: "sjakk-beta.firebaseapp.com",
  databaseURL: "https://sjakk-beta.firebaseio.com",
  projectId: "sjakk-beta",
  storageBucket: "",
  messagingSenderId: "26458714233"
};

const app = firebase.initializeApp(config);

export default app;
