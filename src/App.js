// src/App.js
import React from 'react';
import BlogForm from './components/BlogForm';
import BlogList from './components/BlogList';
import { Container, Typography } from '@mui/material';

const App = () => {
  return (
    <Container maxWidth="md">
      <Typography variant="h3" component="h1" align="center" sx={{ mt: 4 }}>
        My Blog
      </Typography>
      <BlogForm />
      <BlogList />
    </Container>
  );
};

export default App;
