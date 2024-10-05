// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BlogList from './components/BlogList';
import BlogForm from './components/BlogForm';
import { Container, Typography, Button, Box } from '@mui/material';

const App = () => {
  return (
    <Router>
      <Container maxWidth="md">
        <Typography variant="h3" component="h1" align="center" sx={{ mt: 4 }}>
          My Blog
        </Typography>

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 4 }}>
          <Button
            component={Link}
            to="/"
            variant="contained"
            color="primary"
            sx={{ mr: 2 }}
          >
            Home
          </Button>
          <Button
            component={Link}
            to="/create"
            variant="contained"
            color="secondary"
          >
            Create Post
          </Button>
        </Box>

        {/* Define Routes */}
        <Routes>
          <Route path="/" element={<BlogList />} />
          <Route path="/create" element={<BlogForm />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;