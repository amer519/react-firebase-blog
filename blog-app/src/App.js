// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import BlogList from './components/BlogList';
import BlogForm from './components/BlogForm';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute'; // Ensure this component exists
import { Container, Typography, Button, Box } from '@mui/material';
import { useAuth } from './contexts/AuthContext'; // Ensure AuthContext is set up

const App = () => {
  const { currentUser } = useAuth();

  return (
    <Router>
      <Container maxWidth="md">
        {/* App Header */}
        <Typography variant="h3" component="h1" align="center" sx={{ mt: 4 }}>
          My Blog
        </Typography>

        {/* Navigation Buttons */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 2,
            mb: 4,
            gap: 2,
          }}
        >
          {/* Home Button */}
          <Button
            component={Link}
            to="/"
            variant="contained"
            color="primary"
            aria-label="Home"
          >
            Home
          </Button>

          {/* Conditional Rendering Based on Authentication */}
          {currentUser ? (
            <>
              {/* Create Post Button - Visible Only to Authenticated Admin */}
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

            </>
          ) : (
            /* Login Button - Visible Only to Unauthenticated Users */
            <Button
              component={Link}
              to="/login"
              variant="contained"
              color="secondary"
              aria-label="Login"
            >
              Login
            </Button>
          )}
        </Box>

        {/* Define Application Routes */}
        <Routes>
          {/* Home Route - Displays Blog List */}
          <Route path="/" element={<BlogList />} />

          {/* Login Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Create Post Route - Accessible Only to Admin */}
          <Route
            path="/create"
            element={
              
                <BlogForm />
              
            }
          />

          {/* Redirect Unknown Routes to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;