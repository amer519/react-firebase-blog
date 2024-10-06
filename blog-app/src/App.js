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
import { Container, Typography, Button, Box } from '@mui/material';
import { useAuth } from './contexts/AuthContext';

const App = () => {
  const { currentUser } = useAuth(); // Access the current user's authentication state

  return (
    <Router>
      <Container maxWidth="lg">
        {/* App Header */}
        <Box sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom>
            My Professional Blog
          </Typography>
        </Box>

        {/* Navigation Buttons */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 2, // Space between buttons
            mb: 4,
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
          {/* Home Route - Displays Latest Blog */}
          <Route path="/" element={<Home />} />

          {/* Login Route */}
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
    </Router>
  );
};

export default App;