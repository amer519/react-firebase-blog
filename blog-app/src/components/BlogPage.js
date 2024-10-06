// src/components/BlogPage.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Container, Box, Grid, Paper, Typography, Button, Card, CardMedia, CardContent, CircularProgress, Alert } from '@mui/material';
import ReactMarkdown from 'react-markdown';

const BlogPage = () => {
  const { id } = useParams(); // Get blog ID from URL
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [relatedBlogs, setRelatedBlogs] = useState([]);

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

    const fetchRelatedBlogs = async () => {
        try {
          const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(5)); // Fetch 5 blogs initially
          const querySnapshot = await getDocs(q);
          const blogs = querySnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(blog => blog.id !== id) // Exclude the current blog post from related posts
            .slice(0, 3); // Limit to 3 related blogs after filtering
          setRelatedBlogs(blogs);
        } catch (err) {
          console.error('Error fetching related blogs:', err);
        }
      };
      
      

    fetchBlog();
    fetchRelatedBlogs();
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
    <Container sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        {/* Main Blog Content */}
        <Grid item xs={12} md={8}>
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
              <Typography variant="h3" component="h1" sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '2.0rem', fontFamily:'Century Gothic' }}>
                {blog.title}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ textAlign: 'center', mb: 2 }}>
                By {blog.author} | {blog.createdAt?.toDate().toLocaleString()}
              </Typography>

              <ReactMarkdown>{blog.content}</ReactMarkdown>

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
            {relatedBlogs.length > 0 ? (
              <ul style={{ padding: 0, listStyle: 'none' }}>
                {relatedBlogs.map((relatedBlog) => (
                  <li key={relatedBlog.id} style={{ marginBottom: '16px' }}>
                    <Link to={`/blogs/${relatedBlog.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center'}}>
                        {relatedBlog.imageUrl && (
                          <Box
                            component="img"
                            src={relatedBlog.imageUrl}
                            alt={relatedBlog.title}
                            sx={{
                              width: 64,
                              height: 64,
                              objectFit: 'cover',
                              borderRadius: '4px',
                              marginRight: 2,
                            }}
                          />
                        )}
                        <Typography variant="body1" fontWeight="bold" fontFamily="Century Gothic">
                          {relatedBlog.title}
                        </Typography>
                      </Box>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <Typography variant="body2">No related posts available.</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BlogPage;