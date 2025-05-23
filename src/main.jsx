import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import toast, { Toaster } from 'react-hot-toast';
import './styles/main.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    <Toaster position="top-center" />
  </React.StrictMode>
);