import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

/**
 * Application Entry Point
 * LINT-PRO AI Coding Evaluator
 * 
 * @author Lead Software Architect
 * @version 2.0.0
 */

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
