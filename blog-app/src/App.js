// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './components/Home'; // Ensure you have Home.js
import BlogList from './components/BlogList';
import BlogForm from './components/BlogForm';
import BlogPage from './components/BlogPage'; // Newly created component
import Login from './components/Login';
import Logout from './components/Logout'; // Import the Logout component
import ProtectedRoute from './components/ProtectedRoute'; // Ensure this component exists
import { Container, Typography, Button, Box } from '@mui/material';
import { useAuth } from './contexts/AuthContext'; // Ensure AuthContext is set up

const App = () => {
  const { currentUser } = useAuth(); // Access the current user's authentication state

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
            gap: 2, // Space between buttons
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