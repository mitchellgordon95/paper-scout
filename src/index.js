import React from 'react';
import {render} from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css';
import HomeScreen from './HomeScreen';
import reportWebVitals from './reportWebVitals';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

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

render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen/>} />
      </Routes>
    </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
