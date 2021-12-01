import React from 'react';
import {render} from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css';
import MainLayout from './MainLayout'
import HomeScreen from './screens/HomeScreen';
import PaperScreen from './screens/PaperScreen';
import LoginScreen from './screens/LoginScreen';
import LeechScreen from './screens/LeechScreen';
import ScoutScreen from './screens/ScoutScreen';
import reportWebVitals from './reportWebVitals';

// const analytics = getAnalytics(app);

render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout/>}>
            <Route path="/" element={<HomeScreen/>} />
            <Route path="/login" element={<LoginScreen/>} />
            <Route path="/scout" element={<ScoutScreen/>} />
            <Route path="/leech" element={<LeechScreen/>} />
            <Route path="/paper/arxiv/:paperId" element={<PaperScreen/>} />
        </Route>
      </Routes>
    </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
