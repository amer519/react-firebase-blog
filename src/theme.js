import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#8b5cf6',
      light: '#a78bfa',
      dark: '#6d28d9',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
      contrastText: '#000000',
    },
    background: {
      default: '#08080f',
      paper: '#0f0f1a',
    },
    text: {
      primary: '#f1f5f9',
      secondary: '#64748b',
    },
    divider: '#1e1e30',
    error: { main: '#ef4444' },
    success: { main: '#10b981' },
    info: { main: '#06b6d4' },
  },
  typography: {
    fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
    h1: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.03em',
    },
    h2: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    h4: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h5: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 600,
    },
    body1: {
      fontFamily: '"Inter", sans-serif',
      lineHeight: 1.75,
      fontSize: '1rem',
    },
    body2: {
      fontFamily: '"Inter", sans-serif',
      lineHeight: 1.6,
      fontSize: '0.875rem',
    },
    button: {
      fontFamily: '"Space Grotesk", sans-serif',
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.01em',
    },
    overline: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 600,
      letterSpacing: '0.12em',
      fontSize: '0.7rem',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          padding: '10px 22px',
          fontWeight: 600,
          fontSize: '0.875rem',
          transition: 'all 0.2s ease',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
          boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 28px rgba(139, 92, 246, 0.5)',
            transform: 'translateY(-1px)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          boxShadow: '0 4px 20px rgba(245, 158, 11, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 28px rgba(245, 158, 11, 0.5)',
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderColor: '#1e1e30',
          '&:hover': {
            borderColor: '#8b5cf6',
            background: 'rgba(139, 92, 246, 0.06)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#0f0f1a',
          border: '1px solid #1e1e30',
          borderRadius: '16px',
          boxShadow: 'none',
          transition: 'all 0.25s ease',
          '&:hover': {
            borderColor: '#2d2d45',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: '"Space Grotesk", sans-serif',
          fontWeight: 600,
          fontSize: '0.7rem',
          letterSpacing: '0.05em',
          borderRadius: '6px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '10px',
            background: '#14141f',
            '& fieldset': {
              borderColor: '#1e1e30',
            },
            '&:hover fieldset': {
              borderColor: '#2d2d45',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#8b5cf6',
            },
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#8b5cf6',
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#1e1e30',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          background: '#0f0f1a',
          border: '1px solid #1e1e30',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: '24px',
          paddingRight: '24px',
        },
      },
    },
  },
});

export default theme;
