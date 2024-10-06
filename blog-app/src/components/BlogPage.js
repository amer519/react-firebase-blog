// src/components/BlogPage.js
import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useParams, Link } from 'react-router-dom';
import { Typography, Box, CircularProgress, Alert, Button, Card, CardMedia, CardContent, Grid, Paper, Divider } from '@mui/material';
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
      {/* Title inside a container to prevent overflow */}
      <Box sx={{ maxWidth: 'lg', mx: 'auto', textAlign: 'center', mb: 4, py: 2 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '2.5rem',
            paddingTop: 0, // Alternatively, you can fine-tune padding top and bottom
        paddingBottom: 0,
          }}
        >
          {blog.title}
        </Typography>
      </Box>

      {/* Horizontal line below the title, spanning across both blog and sidebar */}
      <Box sx={{ maxWidth: 'lg', mx: 'auto', mb: 4 }}>
        <Divider sx={{ borderBottomWidth: 2 }} />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Grid container spacing={4} maxWidth="lg">
          {/* Main Content Area */}
          <Grid item xs={12} md={8}>
            <Card sx={{ boxShadow: 3 }}>
              {/* Image below the title */}
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
                <Typography variant="subtitle1" color="text.secondary" gutterBottom sx={{ textAlign: 'left' }}>
                  By {blog.author} | {blog.createdAt?.toDate().toLocaleString()}
                </Typography>

                {/* Blog Content */}
                <Box sx={{ textAlign: 'left', lineHeight: 1.8 }}>
                  <ReactMarkdown>{blog.content}</ReactMarkdown>
                </Box>

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
          </Grid>

          {/* Sidebar for Related Posts / Ads */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Related Posts
              </Typography>
              <ul>
                <li><Link to="/blog/related1">Related Blog Post 1</Link></li>
                <li><Link to="/blog/related2">Related Blog Post 2</Link></li>
                <li><Link to="/blog/related3">Related Blog Post 3</Link></li>
              </ul>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default BlogPage;