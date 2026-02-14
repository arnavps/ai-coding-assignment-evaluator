import React from 'react';
import ReactDOM from 'react-dom/client';
import EnhancedApp from './components/EnhancedApp';
import './index.css';

/**
 * Application Entry Point
 * LINT-PRO v2.1.0 - Professional IDE Dashboard with Enhanced UI
 * 
 * @author Lead Software Architect
 * @version 2.1.0
 */

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <EnhancedApp />
  </React.StrictMode>
);
