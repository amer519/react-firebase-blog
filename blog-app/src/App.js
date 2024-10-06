// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './components/Home';
import BlogList from './components/BlogList';
import BlogForm from './components/BlogForm';
import BlogPage from './components/BlogPage';
import Login from './components/Login';
import Logout from './components/Logout';
import ProtectedRoute from './components/ProtectedRoute';
import { Container, Box, Button } from '@mui/material';
import { useAuth } from './contexts/AuthContext';
import { ThemeProvider } from '@mui/material/styles'; // Import ThemeProvider
import theme from './theme'; // Import your theme
import './App.css';

const App = () => {
  const { currentUser } = useAuth(); // Access the current user's authentication state

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="App">
          {/* Professional Header */}
          <header className="App-header">
            <Link to="/" className="App-title">Simba</Link>
          </header>

          <Container maxWidth="lg">
            {/* Navigation Buttons */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 2, // Space between buttons
                mb: 4,
              }}
            >
              {currentUser && (
                <>
                  {/* Create Post Button - Visible Only to Authenticated Users */}
                  <Button
                    component={Link}
                    to="/create"
                    variant="contained"
                    color="secondary"
                    aria-label="Create Post"
                  >
                    Create Post
                  </Button>

                  {/* Logout Button */}
                  <Logout />
                </>
              )}
            </Box>

            {/* Define Application Routes */}
            <Routes>
              {/* Home Route - Displays Latest Blog */}
              <Route path="/" element={<Home />} />

              {/* Login Route - Accessed via Footer Admin Login */}
              <Route path="/login" element={<Login />} />

              {/* Blog List Route */}
              <Route path="/blogs" element={<BlogList />} />

              {/* Individual Blog Page Route */}
              <Route path="/blogs/:id" element={<BlogPage />} />

              {/* Protected Create Post Route - Accessible Only to Authenticated Users */}
              <Route
                path="/create"
                element={
                  <ProtectedRoute>
                    <BlogForm />
                  </ProtectedRoute>
                }
              />

              {/* Redirect Unknown Routes to Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Container>

          {/* Footer with Admin Login */}
          <footer className="App-footer">
            <Link to="/login" className="Admin-login">
              Admin Login
            </Link>
          </footer>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;