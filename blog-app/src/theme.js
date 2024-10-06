// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Customize your primary color
    },
    secondary: {
      main: '#dc004e', // Customize your secondary color
    },
    background: {
      default: '#f5f5f5', // Light gray background
      paper: '#ffffff', // White background for paper components
    },
    text: {
      primary: '#333333', // Dark text for better readability
      secondary: '#555555',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h3: {
      fontWeight: 700,
      marginBottom: '1rem',
    },
    h4: {
      fontWeight: 600,
      marginBottom: '0.75rem',
    },
    body1: {
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none', // Prevent uppercase transformation
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        },
      },
    },
  },
});


export default theme;