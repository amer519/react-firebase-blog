// src/App.js
import React from 'react';
import BlogForm from './components/BlogForm';
import BlogList from './components/BlogList';

const App = () => {
  return (
    <div>
      <h1>My Blog</h1>
      <BlogForm />
      <BlogList />
    </div>
  );
};

export default App;
