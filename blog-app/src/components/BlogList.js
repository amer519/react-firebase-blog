// src/components/BlogList.js
import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Typography, Box, Divider } from '@mui/material';

const BlogList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsData);
    });
    return unsubscribe;
  }, []);

  return (
    <Box sx={{ mt: 4 }}>
      {posts.map(({ id, title, content, createdAt }) => (
        <Box key={id} sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2">
            {title}
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            {content}
          </Typography>
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            {new Date(createdAt.seconds * 1000).toLocaleDateString()}
          </Typography>
          <Divider sx={{ mt: 2 }} />
        </Box>
      ))}
    </Box>
  );
};

export default BlogList;