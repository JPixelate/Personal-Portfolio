import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';
import { UIProvider } from './context/UIContext';

// Developer Signature
console.log(
  "%c JONALD PENPILLO %c Engineering Excellence ",
  "background: #2563eb; color: #fff; padding: 2px 4px; border-radius: 4px 0 0 4px; font-weight: bold;",
  "background: #171717; color: #60a5fa; padding: 2px 4px; border-radius: 0 4px 4px 0;"
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <UIProvider>
        <App />
      </UIProvider>
    </ThemeProvider>
  </React.StrictMode>,
)