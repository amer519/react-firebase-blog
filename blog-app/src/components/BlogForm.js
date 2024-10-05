// src/components/BlogForm.js
import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
  Typography,
} from '@mui/material';

const BlogForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // New States for Handling Loading, Success, and Errors
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset previous messages
    setSuccess('');
    setError('');

    // Simple Client-side Validation
    if (!title.trim() || !content.trim()) {
      setError('Both Title and Content are required.');
      return;
    }

    setLoading(true); // Start Loading

    try {
      await addDoc(collection(db, 'posts'), {
        title: title.trim(),
        content: content.trim(),
        createdAt: serverTimestamp(),
      });
      setSuccess('Post added successfully!');
      setTitle('');
      setContent('');
    } catch (err) {
      console.error('Error adding document: ', err);
      setError('Failed to add post. Please try again.');
    } finally {
      setLoading(false); // End Loading
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ mt: 4, maxWidth: '600px', mx: 'auto' }}
      aria-label="Create Post Form"
    >
      <Typography variant="h4" component="h2" gutterBottom>
        Create a New Post
      </Typography>

      {/* Success Alert */}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        label="Title"
        variant="outlined"
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        sx={{ mb: 2 }}
        inputProps={{ 'aria-label': 'Post Title' }}
      />
      <TextField
        label="Content"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        sx={{ mb: 2 }}
        inputProps={{ 'aria-label': 'Post Content' }}
      />
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          aria-label="Add Post"
        >
          Add Post
        </Button>
        {loading && (
          <CircularProgress
            size={24}
            sx={{
              color: 'primary.main',
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: '-12px',
              marginLeft: '-12px',
            }}
            aria-label="Loading"
          />
        )}
      </Box>
    </Box>
  );
};

export default BlogForm;