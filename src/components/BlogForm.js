// src/components/BlogForm.js
import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, storage } from '../firebase';
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
  Typography,
  InputLabel,
  FormControl,
  FormHelperText,
  Card,
} from '@mui/material';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import imageCompression from 'browser-image-compression';
import { useAuth } from '../contexts/AuthContext';

const BlogForm = () => {
  const { currentUser } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // For image preview

  // States for handling loading, success, and error messages
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');


  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Optional: Validate file type and size
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        setError('Only JPEG, PNG, GIF, WEBP, and AVIF images are allowed.');
        return;
      }

      if (file.size > maxSize) {
        setError('Image size should not exceed 5MB.');
        return;
      }

      try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);
        setImage(compressedFile);
        setImagePreview(URL.createObjectURL(compressedFile)); // Set image preview
        setError(''); // Clear any previous errors
      } catch (err) {
        console.error('Image compression error:', err);
        setError('Failed to compress image. Please try another image.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Reset previous messages
    setSuccess('');
    setError('');
  
    // Client-side Validation
    if (!title.trim() || !content.trim() || !author.trim()) {
      setError('Title, Content, and Author are required.');
      return;
    }
  
    // Check if user is authenticated and authorized
    if (!currentUser) {
      setError('You must be signed in to add a post.');
      return;
    }
  
    // Replace 'YOUR_ADMIN_UID' with the actual UID of your admin user
    const adminUID = 'vqwpiGlbosQWkuSkfI5aFXdaAiZ2';
  
    if (currentUser.uid !== adminUID) {
      setError('You do not have permission to add a post.');
      return;
    }
  
    console.log('Authenticated as admin user:', currentUser.uid);
    
    setLoading(true); // Start Loading
  
    try {
      let imageUrl = '';
  
      // If an image is selected, upload it to Firebase Storage
      if (image) {
        const storageRef = ref(storage, `blog_images/${Date.now()}_${image.name}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }
  
      // Add the blog post to Firestore
      await addDoc(collection(db, 'posts'), {
        title: title.trim(),
        content: content.trim(),
        author: author.trim(),
        imageUrl: imageUrl || '', // Store empty string if no image
        likes: 0,               // Initialize likes to 0
        createdAt: serverTimestamp(),
      });
  
      setSuccess('Post added successfully!');
      setTitle('');
      setContent('');
      setAuthor('');
      setImage(null);
      setImagePreview(null);
  
      // Reset the file input field
      e.target.reset();
    } catch (err) {
      console.error('Error adding document: ', err);
      if (err.code === 'storage/unauthorized') {
        setError('You do not have permission to upload images.');
      } else {
        setError('Failed to add post. Please try again.');
      }
    } finally {
      setLoading(false); // End Loading
    }
  };  
  

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ mt: 4, maxWidth: '800px', mx: 'auto' }}
      aria-label="Create Post Form"
    >
      <Card sx={{ boxShadow: 3, p: 3 }}>
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
          sx={{ mb: 3 }}
          inputProps={{ 'aria-label': 'Post Title' }}
        />

        <TextField
          label="Content"
          variant="outlined"
          fullWidth
          multiline
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          sx={{ mb: 3 }}
          inputProps={{ 'aria-label': 'Post Content' }}
        />

        <TextField
          label="Author's Name"
          variant="outlined"
          fullWidth
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
          sx={{ mb: 3 }}
          inputProps={{ 'aria-label': "Author's Name" }}
        />

        {/* Image Upload Field with Preview */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel htmlFor="image-upload">Upload Image</InputLabel>
          <Button
            variant="contained"
            component="label"
            color="secondary"
            sx={{ mt: 1 }}
            aria-label="Upload Image"
          >
            Choose Image
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </Button>
          {image && <FormHelperText>{image.name}</FormHelperText>}
        </FormControl>

        {/* Image Preview */}
        {imagePreview && (
          <Box sx={{ mb: 3 }}>
            <img
              src={imagePreview}
              alt="Selected"
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
            />
          </Box>
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
      </Card>
    </Box>
  );
};

export default BlogForm;