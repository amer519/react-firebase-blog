// src/components/BlogPage.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, query, orderBy, limit, getDocs, addDoc, Timestamp, updateDoc, increment, } from 'firebase/firestore';
import { db } from '../firebase';
import {
  Container,
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  Alert,
  Divider,
  TextField,
  Avatar,
} from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { Filter } from 'bad-words';
import ThumbUpIcon from '@mui/icons-material/ThumbUp'; // Import Material UI Thumbs up icon
import IconButton from '@mui/material/IconButton'; // For the button functionality
import { useAuth } from '../contexts/AuthContext';  // Import your custom hook
import grayMatter from 'gray-matter';

const BlogPage = () => {
  const { id } = useParams(); // Get blog ID from URL
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [name, setName] = useState('');
  const filter = new Filter(); // Initialize bad-words filter
  const [likes, setLikes] = useState(0);  // State for storing the number of likes
  const [liked, setLiked] = useState(false); // State to track if the user liked the post
  const { currentUser } = useAuth();  // Access the currentUser from the AuthContext


  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const docRef = doc(db, 'posts', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const blogContent = docSnap.data().content; // Assuming your blog content is stored in 'content'
          const { data: frontmatter, content } = grayMatter(blogContent); // Parse frontmatter and content
          
          setBlog({ id: docSnap.id, frontmatter, content }); // Set both frontmatter and content          
          setLikes(frontmatter.likes || 0);  // Set the likes count from Firestore (if it exists)
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
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((blog) => blog.id !== id) // Exclude the current blog post from related posts
          .slice(0, 3); // Limit to 3 related blogs after filtering
        setRelatedBlogs(blogs);
      } catch (err) {
        console.error('Error fetching related blogs:', err);
      }
    };

    const fetchComments = async () => {
      try {
        const commentsRef = collection(db, 'posts', id, 'comments');
        const commentsQuery = query(commentsRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(commentsQuery);
        const fetchedComments = querySnapshot.docs.map((doc) => doc.data());
        setComments(fetchedComments);
      } catch (err) {
        console.error('Error fetching comments:', err);
      }
    };

    fetchBlog();
    fetchRelatedBlogs();
    fetchComments();
  }, [id]);

  const handleCommentSubmit = async () => {
    const commentData = {
      name: name || 'Anonymous',
      comment: filter.clean(newComment), // Use filter to clean the comment
      createdAt: new Date(),
    };

    try {
      const commentsRef = collection(db, 'posts', id, 'comments');

      // Get the last comment by this user
    const lastCommentQuery = query(commentsRef, orderBy('createdAt', 'desc'), limit(1));
    const lastCommentSnapshot = await getDocs(lastCommentQuery);

    let canComment = true;

    if (!lastCommentSnapshot.empty) {
      const lastComment = lastCommentSnapshot.docs[0].data();
      const lastCommentTime = lastComment.createdAt.toDate();
      const currentTime = new Date();
      const timeDifference = (currentTime - lastCommentTime) / (1000 * 60); // Time difference in minutes

      // Check if the last comment was made within the last 5 minutes
      if (timeDifference < 5) {
        canComment = false;
        alert('You can only comment once every 5 minutes.');
      }
    }

    if (canComment) {
      const commentData = {
        name: name || 'Anonymous',
        comment: filter.clean(newComment),
        createdAt: Timestamp.now(),  // Store the current timestamp
      };
      
      await addDoc(commentsRef, commentData);
      setComments([commentData, ...comments]); // Update the comments list
      setNewComment(''); // Clear the comment input
      setName(''); // Clear the name input
    }
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const handleLike = async () => {
    if (!liked) {
      const postRef = doc(db, 'posts', id);  // Get the post reference from Firestore
  
      await updateDoc(postRef, {
        likes: increment(1),  // Increment the number of likes by 1 in Firestore
      });
  
      setLikes(likes + 1);  // Update the likes count in the component's state
      setLiked(true);  // Set the liked state to true so the user can't like it again
    }
  };  

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
        {/* Main Content Area */}
        <Grid item xs={12} md={8}>
          {/* Blog Content */}
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
            <Typography
              variant="h3"
              component="h1"
              sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '2.0rem', fontFamily: 'Century Gothic' }}
              >
                {blog.frontmatter.title}
              </Typography>

              {/* Horizontal line below the title, spanning across both blog and sidebar */}
              <Box sx={{ maxWidth: 'lg', mx: 'auto', mb: 4 }}>
                <Divider sx={{ borderBottomWidth: 2 }} />
              </Box>
              <Typography variant="subtitle1" color="text.secondary" sx={{ textAlign: 'center', mb: 2 }}>
                By {blog.frontmatter.author} | {new Date(blog.frontmatter.date).toLocaleDateString()}
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
              {/* Like Button */}
  <IconButton
    onClick={handleLike}  // Calls the handleLike function when clicked
    sx={{
      color: liked ? '#1976d2' : '#999',  // Changes color if liked
      '&:hover': { color: '#1976d2' },  // Changes color on hover
    }}
  >
    {/* <ThumbUpIcon />  Thumbs up icon */}
    {/* <span role="img" aria-label="like">👍</span> */}
  </IconButton>

  {/* Likes Counter */}
  <Typography variant="body1" sx={{ ml: 1 }}>
    {/* {likes} */}
  </Typography>
            </CardContent>
          </Card>

          {/* Comment Section */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Leave a Comment
            </Typography>
            <TextField
              fullWidth
              label="Your Name (optional)"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Your Comment"
              variant="outlined"
              multiline
              rows={4}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button variant="contained" color="primary" onClick={handleCommentSubmit}>
              Submit Comment
            </Button>

            {/* Display Comments */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Comments
              </Typography>
              {comments.length > 0 ? (
                comments.map((comment, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: '#1976d2', mr: 2 }}>{comment.name[0]}</Avatar>
                    <Box>
                      <Typography variant="subtitle2">{comment.name}</Typography>
                      <Typography variant="body2">{comment.comment}</Typography>
                    </Box>
                  </Box>
                ))
              ) : (
                <Typography>No comments yet. Be the first to comment!</Typography>
              )}
            </Box>
          </Box>
        </Grid>

        {/* Sidebar for Related Posts / Ads */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Related Posts
            </Typography>
            <Box sx={{ maxWidth: 'lg', mx: 'auto', mb: 4 }}>
              <Divider sx={{ borderBottomWidth: 2 }} />
            </Box>
            {relatedBlogs.length > 0 ? (
              <ul style={{ padding: 0, listStyle: 'none' }}>
                {relatedBlogs.map((relatedBlog) => (
                  <li key={relatedBlog.id} style={{ marginBottom: '16px' }}>
                    <Link to={`/blogs/${relatedBlog.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
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