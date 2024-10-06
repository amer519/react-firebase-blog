// src/components/Home.js
import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Typography, Box, CircularProgress, Alert, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLatestBlog = async () => {
      try {
        const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(1));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const docData = querySnapshot.docs[0].data();
          const id = querySnapshot.docs[0].id;
          setBlog({ id, ...docData });
        } else {
          setError('No blog posts found.');
        }
      } catch (err) {
        console.error('Error fetching latest blog:', err);
        setError('Failed to fetch the latest blog post.');
      } finally {
        setLoading(false);
      }
    };

    fetchLatestBlog();
  }, []);

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

export default Home;