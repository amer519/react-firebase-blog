import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Card, CardContent, Typography } from '@mui/material';

const BlogList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const postsArray = [];
      querySnapshot.forEach((doc) => {
        postsArray.push({ id: doc.id, ...doc.data() });
      });
      setPosts(postsArray);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div>
      {posts.map((post) => (
        <Card key={post.id} style={{ marginBottom: '20px' }}>
          <CardContent>
            <Typography variant="h5">{post.title}</Typography>
            <Typography variant="body2" color="textSecondary">
              {post.createdAt.toDate().toDateString()}
            </Typography>
            <Typography variant="body1">{post.content}</Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BlogList;
