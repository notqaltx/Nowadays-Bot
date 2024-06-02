import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import Routes from './Routes';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Routes />
  </React.StrictMode>
);
reportWebVitals();
