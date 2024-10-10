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
    <Box 
  sx={{ 
    mt: 4, 
    mb: 4, 
    display: 'flex', 
    flexDirection: { xs: 'column', md: 'row' }, 
    gap: 3, 
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center'
  }}
>
      {blogs.map((blog) => (
        <Link 
          to={`/blogs/${blog.id}`} 
          key={blog.id} 
          style={{ textDecoration: 'none', flex: 1 }}
        >
          <Card 
  sx={{ 
    boxShadow: 3, 
    height: '100%', 
    cursor: 'pointer', 
    width: { xs: '100%', md: '350px' }, // Fixed consistent width
    maxWidth: 350, // Prevents the card from stretching too much
  }}
>
            {blog.imageUrl && (
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
            )}
            <CardContent>
              <Typography variant="h4" component="h2" fontFamily="Century Gothic" gutterBottom>
                {blog.title.length > 50 ? `${blog.title.substring(0, 50)}...` : blog.title}
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
            </CardContent>
          </Card>
        </Link>
      ))}
    </Box>
  );  
};

export default Home;