// src/components/BlogList.js
import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Typography, Box, Divider, Avatar } from '@mui/material';

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
        <Typography variant="h6">Loading posts...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" color="error" align="center">
          {error}
        </Typography>
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
        posts.map(({ id, title, content, author, imageUrl, createdAt }) => (
          <Box key={id} sx={{ mb: 6, p: 2, boxShadow: 3, borderRadius: 2 }}>
            {/* Author Information */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              {/* You can replace the Avatar with the author's profile picture if available */}
              <Avatar sx={{ mr: 2 }}>{author.charAt(0).toUpperCase()}</Avatar>
              <Typography variant="subtitle1" component="span">
                {author}
              </Typography>
            </Box>

            {/* Title */}
            <Typography variant="h5" component="h2">
              {title}
            </Typography>

            {/* Content */}
            <Typography variant="body1" sx={{ mt: 1 }}>
              {content}
            </Typography>

            {/* Image */}
            {imageUrl && (
              <Box sx={{ mt: 2 }}>
                <img
                  src={imageUrl}
                  alt={title}
                  style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px' }}
                />
              </Box>
            )}

            {/* Timestamp */}
            {createdAt && typeof createdAt.toDate === 'function' ? (
              <Typography variant="caption" display="block" sx={{ mt: 2, color: 'text.secondary' }}>
                {createdAt.toDate().toLocaleString()}
              </Typography>
            ) : (
              <Typography variant="caption" display="block" sx={{ mt: 2, color: 'text.secondary' }}>
                Date not available
              </Typography>
            )}
            <Divider sx={{ mt: 3 }} />
          </Box>
        ))
      )}
    </Box>
  );
};

export default BlogList;