// src/App.js
import React from 'react';
import BlogForm from './components/BlogForm';
import BlogList from './components/BlogList';
import { Container, Typography } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';



const App = () => {
  return (
    <Router>
      <Container maxWidth="md">
        <Typography variant="h3" component="h1" align="center" sx={{ mt: 4 }}>
          My Blog
        </Typography>
        <Routes>
          <Route path="/" element={<BlogList />} />
          <Route path="/create" element={<BlogForm />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
