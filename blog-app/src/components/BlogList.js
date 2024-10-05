// src/components/BlogList.js
import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Typography, Box, Divider, CircularProgress, Alert } from '@mui/material';

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // To handle loading state
  const [error, setError] = useState(null);     // To handle errors

  useEffect(() => {
    // Create a query against the 'posts' collection, ordered by 'createdAt' descending
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));

    // Subscribe to real-time updates with error handling
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const postsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(postsData);
        setLoading(false); // Data fetched successfully
      },
      (error) => {
        console.error('Error fetching posts:', error);
        setError('Failed to fetch posts. Please try again later.');
        setLoading(false); // Stop loading on error
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      {posts.length === 0 ? (
        <Typography variant="h6" align="center">
          No posts available.
        </Typography>
      ) : (
        posts.map(({ id, title, content, createdAt }) => (
          <Box key={id} sx={{ mb: 4 }}>
            <Typography variant="h5" component="h2">
              {title}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {content}
            </Typography>
            {createdAt && typeof createdAt.toDate === 'function' ? (
              <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                {createdAt.toDate().toLocaleDateString()}
              </Typography>
            ) : (
              <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                Date not available
              </Typography>
            )}
            <Divider sx={{ mt: 2 }} />
          </Box>
        ))
      )}
    </Box>
  );
};

export default BlogList;