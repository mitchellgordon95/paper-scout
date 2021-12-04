import { initializeApp } from 'firebase/app'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyA4ji48pLAuBxBtmJx6DZxarzGPKoZrv8w',
  authDomain: 'paper-scout.firebaseapp.com',
  projectId: 'paper-scout',
  storageBucket: 'paper-scout.appspot.com',
  messagingSenderId: '771182993262',
  appId: '1:771182993262:web:e3c6b1311024539c8eeb7f',
  measurementId: 'G-WTE4YWNT0H',
}
const firebaseApp = initializeApp(firebaseConfig)

export default firebaseApp
