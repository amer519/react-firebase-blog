// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client'; // Correct import for React 18
import App from './App';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { AuthProvider } from './contexts/AuthContext';

// Locate the root DOM node
const container = document.getElementById('root');

// Create a root
const root = createRoot(container);

// Render the application
root.render(
  <React.StrictMode>
    <AuthProvider>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);