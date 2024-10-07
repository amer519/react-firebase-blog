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
    fontFamily: 'Poppins, Roboto, sans-serif', // Use Poppins with fallback to Roboto
    h3: {
      fontFamily: 'Poppins, sans-serif',
      fontWeight: 700,
      marginBottom: '1rem',
    },
    h4: {
      fontFamily: 'Poppins, sans-serif',
      fontWeight: 600,
      marginBottom: '0.75rem',
    },
    body1: {
      fontFamily: 'Poppins, sans-serif',
      lineHeight: 1.6,
    },
    button: {
      fontFamily: 'Poppins, sans-serif',
      textTransform: 'none', // Prevent uppercase transformation
      fontWeight: 500, // Slightly bold for button text
      borderRadius: '8px', // Rounded corners for a modern look
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '10px 20px', // Sleek padding for buttons
          transition: 'background-color 0.3s ease', // Smooth hover effect
        },
      },
    },
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          h1: 'h1',
          h2: 'h2',
          h3: 'h3',
          h4: 'h4',
          body1: 'p', // Ensures semantic HTML tags for text
        },
      },
      styleOverrides: {
        h3: {
          fontSize: '2.5rem', // Make h3 bold and modern
          color: '#333333', // Add primary color to header elements
        },
        body1: {
          fontSize: '1rem', // Standard body font size
          lineHeight: 1.8, // Improved readability
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
          color: '#ffffff', // Make links in the header white
          fontWeight: 'bold',
          fontSize: '1.5rem',
          letterSpacing: '1px',
          '&:hover': {
            color: '#eeeeee', // Light hover effect
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          padding: '20px',
        },
      },
    },
    MuiBox: {
      styleOverrides: {
        root: {
          textAlign: 'center',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, #1976d2, #64b5f6)', // Header gradient
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow for the header
        },
      },
    },
    MuiFooter: {
      styleOverrides: {
        root: {
          backgroundColor: '#282c34',
          color: 'white',
          textAlign: 'center',
          padding: '20px',
          position: 'fixed',
          bottom: 0,
          width: '100%',
        },
      },
    },
  },
});

export default theme;