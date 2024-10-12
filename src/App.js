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
import { ThemeProvider } from '@mui/material/styles'; // Import ThemeProvider
import theme from './theme'; // Import your theme
import './App.css';
import { AuthProvider, useAuth } from './contexts/AuthContext'; // Import Auth context provider


// // Export RoutesList for sitemap generation
// export const RoutesList = (
//   <Routes>
//     {/* Home Route - Displays Latest Blog */}
//     <Route path="/" element={<Home />} />

//     {/* Login Route - Accessed via Footer Admin Login */}
//     <Route path="/login" element={<Login />} />

//     {/* Blog List Route */}
//     <Route path="/blogs" element={<BlogList />} />

//     {/* Individual Blog Page Route */}
//     <Route path="/blogs/:id" element={<BlogPage />} />

//     {/* Protected Create Post Route - Accessible Only to Authenticated Users */}
//     <Route
//       path="/create"
//       element={
//         <ProtectedRoute>
//           <BlogForm />
//         </ProtectedRoute>
//       }
//     />

//     {/* Redirect Unknown Routes to Home */}
//     <Route path="*" element={<Navigate to="/" replace />} />
//   </Routes>
// );

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>  {/* Wrap your app in AuthProvider */}
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
                <ProtectedButtons />
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
      </AuthProvider>
    </ThemeProvider>
  );
};

// Separate component to handle buttons that rely on authentication state
const ProtectedButtons = () => {
  const { currentUser } = useAuth(); // Now safely inside the AuthProvider

  return (
    <>
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
    </>
  );
};

export default App;