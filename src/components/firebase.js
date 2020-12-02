import firebase from 'firebase'


const config = {
  apiKey: "AIzaSyCHfqa4JoHNitRAsVlzXHGMfob5ECUodCo",
  authDomain: "supermart-app1k.firebaseapp.com",
  databaseURL: "https://supermart-app1k.firebaseio.com",
  projectId: "supermart-app1k",
  storageBucket: "supermart-app1k.appspot.com",
  messagingSenderId: "858 892330702",
  appId: "1:858892330702:web:cfb1a53d6f0dafdbfc129f",
  measurementId: "G-N4RFBD4715"
  };
  
  
  firebase.initializeApp(config);

  export default firebase
