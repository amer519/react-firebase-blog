// src/components/BlogPage.js
import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useParams, Link } from 'react-router-dom';
import { Typography, Box, CircularProgress, Alert, Button, Card, CardMedia, CardContent } from '@mui/material';
import ReactMarkdown from 'react-markdown';

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

          {/* Use ReactMarkdown to render blog content */}
          <ReactMarkdown>
            {blog.content}
          </ReactMarkdown>

          <Button
            component={Link}
            to="/blogs"
            variant="contained"
            color="primary"
            aria-label="Back to Blog List"
            sx={{ mt: 2 }}
          >
            Back to Blog List
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BlogPage;