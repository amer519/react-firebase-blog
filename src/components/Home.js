// src/components/Home.js
import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import {
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
  Card,
  CardMedia,
  CardContent,
  Divider
} from '@mui/material';
import ReactMarkdown from 'react-markdown';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLatestBlog = async () => {
      try {
        const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(3));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const fetchedBlogs = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setBlogs(fetchedBlogs);
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
  if (!blogs.length) {
    return null;
  }
  
  return (
    <Box sx={{ mt: 4, mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
      {blogs.map((blog) => (
        <Card key={blog.id} sx={{ boxShadow: 3, flex: 1 }}>
          {blog.imageUrl && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <CardMedia
                component="img"
                image={blog.imageUrl}
                alt={blog.title}
                sx={{
                  width: 'auto',
                  maxWidth: '100%',
                  height: 'auto',
                  maxHeight: { xs: 300, md: 500 },
                  objectFit: 'contain',
                  borderRadius: 1,
                }}
              />
            </Box>
          )}
          <CardContent>
            <Typography variant="h4" component="h2" fontFamily="Century Gothic" gutterBottom>
              {blog.title}
            </Typography>
            <Box sx={{ maxWidth: 'lg', mx: 'auto', mb: 4 }}>
              <Divider sx={{ borderBottomWidth: 2 }} />
            </Box>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              By {blog.author} | {blog.createdAt?.toDate().toLocaleString()}
            </Typography>
            <ReactMarkdown>
              {blog.content.length > 200 ? `${blog.content.substring(0, 200)}...` : blog.content}
            </ReactMarkdown>
            <Button
              component={Link}
              to={`/blogs/${blog.id}`}
              variant="contained"
              color="primary"
              aria-label="Read More"
            >
              Read More
            </Button>
          </CardContent>
        </Card>
      ))}
    </Box>
  );  
};

export default Home;