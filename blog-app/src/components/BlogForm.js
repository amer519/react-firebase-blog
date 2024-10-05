// src/components/BlogForm.js
import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, storage } from '../firebase';
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
  Typography,
} from '@mui/material';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const BlogForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [image, setImage] = useState(null);

  // New States for Handling Loading, Success, and Errors
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset previous messages
    setSuccess('');
    setError('');

    // Simple Client-side Validation
    if (!title.trim() || !content.trim() || !author.trim()) {
      setError('Title, Content, and Author are required.');
      return;
    }

    setLoading(true); // Start Loading

    try {
      let imageUrl = '';

      // If an image is selected, upload it to Firebase Storage
      if (image) {
        const imageRef = ref(storage, `blog_images/${Date.now()}_${image.name}`);
        const snapshot = await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      // Add the blog post to Firestore
      await addDoc(collection(db, 'posts'), {
        title: title.trim(),
        content: content.trim(),
        author: author.trim(),
        imageUrl: imageUrl || '', // Store empty string if no image
        createdAt: serverTimestamp(),
      });

      setSuccess('Post added successfully!');
      setTitle('');
      setContent('');
      setAuthor('');
      setImage(null);

      // Optionally, you can reset the file input field
      e.target.reset();
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
      <TextField
        label="Author's Name"
        variant="outlined"
        fullWidth
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        required
        sx={{ mb: 2 }}
        inputProps={{ 'aria-label': 'Author Name' }}
      />
      <Button variant="contained" component="label" sx={{ mb: 2 }}>
        Upload Image
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={handleImageChange}
        />
      </Button>
      {image && (
        <Typography variant="body2" sx={{ mb: 2 }}>
          Selected Image: {image.name}
        </Typography>
      )}
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