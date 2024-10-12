// src/components/BlogForm.js
import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
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

const BlogForm = ({ post }) => {
  const { currentUser } = useAuth();
  const [title, setTitle] = useState(post ? post.title : '');
  const [content, setContent] = useState(post ? post.content : '');
  const [author, setAuthor] = useState(post ? post.author : '');
  const [image, setImage] = useState(null); // Image must be selected again for edits
  const [imagePreview, setImagePreview] = useState(post ? post.imageUrl : null);
  const [imageAlt, setImageAlt] = useState(post ? post.imageAlt : ''); 
  const [postSummary, setPostSummary] = useState(post ? post.postSummary : '');
  const [videoId, setVideoId] = useState(post ? post.videoId : '');

  // States for handling loading, success, and error messages
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif'];
      const maxSize = 5 * 1024 * 1024;

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
        setImagePreview(URL.createObjectURL(compressedFile));
        setError('');
      } catch (err) {
        console.error('Image compression error:', err);
        setError('Failed to compress image. Please try another image.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    setSuccess('');
    setError('');
  
    if (!title.trim() || !content.trim() || !author.trim() || !postSummary.trim()) {
      setError('Title, Content, Author, and Post Summary are required.');
      return;
    }
  
    if (!currentUser) {
      setError('You must be signed in to add or edit a post.');
      return;
    }
  
    const adminUID = 'vqwpiGlbosQWkuSkfI5aFXdaAiZ2';
    if (currentUser.uid !== adminUID) {
      setError('You do not have permission to add or edit posts.');
      return;
    }
  
    setLoading(true);
  
    try {
      let imageUrl = post?.imageUrl || '';
  
      if (image) {
        const storageRef = ref(storage, `blog_images/${Date.now()}_${image.name}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }
  
      const postData = {
        title: title.trim(),
        content: content.trim(),
        author: author.trim(),
        imageUrl: imageUrl || '',
        imageAlt: imageAlt.trim(),
        postSummary: postSummary.trim(),
        videoId: videoId.trim(),
        updatedAt: serverTimestamp(),
      };
  
      if (post) {
        // Update existing post
        const postRef = doc(db, 'posts', post.id);
        await updateDoc(postRef, postData);
        setSuccess('Post updated successfully!');
      } else {
        // Add new post
        await addDoc(collection(db, 'posts'), {
          ...postData,
          likes: 0,
          createdAt: serverTimestamp(),
        });
        setSuccess('Post added successfully!');
      }
  
      // Clear form fields after submission
      setTitle('');
      setContent('');
      setAuthor('');
      setImage(null);
      setImagePreview(null);
      setImageAlt('');
      setPostSummary('');
      setVideoId('');
  
      e.target.reset();
    } catch (err) {
      console.error('Error adding or updating document: ', err);
      if (err.code === 'storage/unauthorized') {
        setError('You do not have permission to upload images.');
      } else {
        setError('Failed to add or update post. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };  

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ mt: 4, maxWidth: '800px', mx: 'auto' }}
      aria-label="Create Post Form"
    >
      <Card sx={{ boxShadow: 3, p: 3 }}> {/* Opening the Card here */}
        <Typography variant="h4" component="h2" gutterBottom>
          {post ? 'Edit Post' : 'Create a New Post'}
        </Typography>
  
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
  
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
  
        <TextField
          label="Post Summary (Alt Text for Post)"
          variant="outlined"
          fullWidth
          value={postSummary}
          onChange={(e) => setPostSummary(e.target.value)}
          required
          sx={{ mb: 3 }}
          inputProps={{ 'aria-label': 'Post Summary' }}
        />
  
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
  
        <TextField
          label="Image Alt Text"
          variant="outlined"
          fullWidth
          value={imageAlt}
          onChange={(e) => setImageAlt(e.target.value)}
          sx={{ mb: 3 }}
          inputProps={{ 'aria-label': 'Image Alt Text' }}
        />

        <TextField
          label="YouTube Video ID"
          variant="outlined"
          fullWidth
          value={videoId}
          onChange={(e) => setVideoId(e.target.value)}
          sx={{ mb: 3 }}
          inputProps={{ 'aria-label': 'YouTube Video ID' }}
        />

  
        {imagePreview && (
          <Box sx={{ mb: 3, display: 'inline-block' }}>
            <img
              src={imagePreview}
              alt="Selected"
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
            />
          </Box>
        )}
  
        <Box sx={{ position: 'relative', display: 'inline-flex', gap: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            aria-label={post ? 'Update Post' : 'Add Post'}
          >
            {post ? 'Update Post' : 'Add Post'}
          </Button>
          {post && (
            <Button
              variant="outlined"
              onClick={() => {
                // Logic to cancel editing (if needed)
              }}
              aria-label="Cancel Edit"
            >
              Cancel
            </Button>
          )}
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
      </Card> {/* Closing the Card here */}
    </Box>
  );  
};

export default BlogForm;