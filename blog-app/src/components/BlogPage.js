// src/components/BlogPage.js
import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useParams, Link } from 'react-router-dom';
import { Typography, Box, CircularProgress, Alert, Button } from '@mui/material';

const BlogPage = () => {
  const { id } = useParams(); // Get blog ID from URL
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const docRef = doc(db, 'posts', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setBlog({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError('No such blog post found.');
        }
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError('Failed to fetch the blog post.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress aria-label="Loading" />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        {error}
      </Alert>
    );
  }

  if (!blog) {
    return null;
  }

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        {blog.title}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        By {blog.author} | {blog.createdAt?.toDate().toLocaleString()}
      </Typography>
      {blog.imageUrl && (
        <Box sx={{ my: 2 }}>
          <img src={blog.imageUrl} alt={blog.title} style={{ maxWidth: '100%', height: 'auto' }} />
        </Box>
      )}
      <Typography variant="body1" paragraph>
        {blog.content}
      </Typography>
      <Button component={Link} to="/blogs" variant="outlined" color="primary">
        View All Blogs
      </Button>
    </Box>
  );
};

export default BlogPage;