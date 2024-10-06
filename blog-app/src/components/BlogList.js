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
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {blogs.map(blog => (
          <Card key={blog.id} sx={{ display: 'flex', cursor: 'pointer' }}>
            {blog.imageUrl && (
              <CardMedia
                component="img"
                sx={{ width: 160 }}
                image={blog.imageUrl}
                alt={blog.title}
              />
            )}
            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <CardContent>
                <Typography component="div" variant="h5">
                  <Link to={`/blogs/${blog.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {blog.title}
                  </Link>
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" component="div">
                  By {blog.author} | {blog.createdAt?.toDate().toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {blog.content.substring(0, 100)}...
                </Typography>
              </CardContent>
              <Box sx={{ flexGrow: 1 }} />
              <Box sx={{ p: 2 }}>
                <Button
                  component={Link}
                  to={`/blogs/${blog.id}`}
                  variant="outlined"
                  color="primary"
                  size="small"
                  aria-label={`Read more about ${blog.title}`}
                >
                  Read More
                </Button>
              </Box>
            </Box>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default BlogList;
