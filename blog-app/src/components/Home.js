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
    CardContent 
} from '@mui/material';
import ReactMarkdown from 'react-markdown';

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
      <Card sx={{ boxShadow: 3 }}>
        {blog.imageUrl && (
          <CardMedia
            component="img"
            height="400"
            image={blog.imageUrl}
            alt={blog.title}
            sx={{ objectFit: 'cover' }}
          />
        )}
        <CardContent>
          <Typography variant="h4" component="h2" gutterBottom>
            {blog.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            By {blog.author} | {blog.createdAt?.toDate().toLocaleString()}
          </Typography>

          {/* Display Markdown content properly */}
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
    </Box>
  );
};

export default Home;