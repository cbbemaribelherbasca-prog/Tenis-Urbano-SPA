import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { ShopProvider } from './context/ShopContext';
import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-500.css';
import '@fontsource/dm-sans/latin-600.css';
import '@fontsource/dm-sans/latin-700.css';
import '@fontsource/space-grotesk/latin-500.css';
import '@fontsource/space-grotesk/latin-600.css';
import '@fontsource/space-grotesk/latin-700.css';
import '../styles.css';
import './shell.css';
import './experience.css';
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <ShopProvider>
        <App />
      </ShopProvider>
    </HashRouter>
  </React.StrictMode>
);
