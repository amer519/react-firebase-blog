// src/components/BlogList.js
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import {
  Typography,
  Box,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardMedia,
  Button,
  Grid,
} from '@mui/material';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const blogsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBlogs(blogsData);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to fetch blog posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
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

  if (blogs.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 4 }}>
        No blog posts available.
      </Alert>
    );
  }

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        All Blogs
      </Typography>
      <Grid container spacing={4}>
        {blogs.map(blog => (
          <Grid item xs={12} sm={6} md={4} key={blog.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {blog.imageUrl && (
                <CardMedia
                  component="img"
                  height="200"
                  image={blog.imageUrl}
                  alt={blog.title}
                  sx={{ objectFit: 'cover' }}
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="h3" gutterBottom>
                  <Link to={`/blogs/${blog.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {blog.title}
                  </Link>
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  By {blog.author} | {blog.createdAt?.toDate().toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {blog.content.length > 100 ? `${blog.content.substring(0, 100)}...` : blog.content}
                </Typography>
              </CardContent>
              <Box sx={{ p: 2 }}>
                <Button
                  component={Link}
                  to={`/blogs/${blog.id}`}
                  variant="contained"
                  color="primary"
                  fullWidth
                  aria-label={`Read more about ${blog.title}`}
                >
                  Read More
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BlogList;