import './App.css';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA4ji48pLAuBxBtmJx6DZxarzGPKoZrv8w",
  authDomain: "paper-scout.firebaseapp.com",
  projectId: "paper-scout",
  storageBucket: "paper-scout.appspot.com",
  messagingSenderId: "771182993262",
  appId: "1:771182993262:web:e3c6b1311024539c8eeb7f",
  measurementId: "G-WTE4YWNT0H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Paper Scout V1</h1>
        <button>SCOUT</button>
        <button>LEECH</button>
      </header>
    </div>
  );
}

export default App;
