import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  doc, getDoc, collection, query, orderBy, limit, getDocs,
  addDoc, Timestamp, updateDoc, increment,
} from 'firebase/firestore';
import { db, analytics } from '../firebase';
import { logEvent } from 'firebase/analytics';
import {
  Box, Container, Grid, Typography, Button, CircularProgress,
  TextField, Avatar, Chip, Divider,
} from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { Filter } from 'bad-words';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ShareIcon from '@mui/icons-material/Share';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from '../contexts/AuthContext';
import ArticleCard from './ArticleCard';
import NewsletterSignup from './NewsletterSignup';

const CATEGORY_COLORS = {
  'power-rankings': { bg: 'rgba(139, 92, 246, 0.12)', color: '#a78bfa', label: 'Power Rankings' },
  'collector-guides': { bg: 'rgba(245, 158, 11, 0.12)', color: '#fbbf24', label: 'Collector Guide' },
  'nostalgia-vault': { bg: 'rgba(6, 182, 212, 0.12)', color: '#22d3ee', label: 'Nostalgia Vault' },
  'card-of-the-week': { bg: 'rgba(16, 185, 129, 0.12)', color: '#34d399', label: 'Card of the Week' },
  'battle-debate': { bg: 'rgba(239, 68, 68, 0.12)', color: '#f87171', label: 'Battle Debate' },
  'beginner-guides': { bg: 'rgba(99, 102, 241, 0.12)', color: '#818cf8', label: 'Beginner Guide' },
  'drop-story': { bg: 'rgba(245, 158, 11, 0.12)', color: '#fbbf24', label: 'Drop Story' },
  'display-setup': { bg: 'rgba(139, 92, 246, 0.12)', color: '#a78bfa', label: 'Display Setup' },
  'worth-it': { bg: 'rgba(6, 182, 212, 0.12)', color: '#22d3ee', label: 'Worth It?' },
};

// Renders a full-width article hero image; silently hides itself if the URL returns an error (e.g. 402/403).
const HeroImage = ({ src, alt }) => {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <Box sx={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #1e1e30', mb: 4 }}>
      <Box
        component="img"
        src={src}
        alt={alt}
        onError={() => setFailed(true)}
        sx={{ width: '100%', height: 'auto', maxHeight: { xs: 260, md: 440 }, objectFit: 'cover', display: 'block' }}
      />
    </Box>
  );
};

const estimateReadTime = (content = '') =>
  Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200));

const BlogPage = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentSuccess, setCommentSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const filter = new Filter();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [docSnap, relSnap, commentSnap] = await Promise.all([
          getDoc(doc(db, 'posts', id)),
          getDocs(query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(5))),
          getDocs(query(collection(db, 'posts', id, 'comments'), orderBy('createdAt', 'desc'))),
        ]);

        if (docSnap.exists()) {
          setBlog({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError('Article not found.');
        }

        const related = relSnap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(b => b.id !== id)
          .slice(0, 3);
        setRelatedBlogs(related);
        setComments(commentSnap.docs.map(d => d.data()));
      } catch (err) {
        console.error(err);
        setError('Failed to load article.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setCommentLoading(true);
    try {
      const commentsRef = collection(db, 'posts', id, 'comments');
      const lastSnap = await getDocs(query(commentsRef, orderBy('createdAt', 'desc'), limit(1)));
      if (!lastSnap.empty) {
        const lastTime = lastSnap.docs[0].data().createdAt?.toDate?.() || new Date(0);
        if ((new Date() - lastTime) / 60000 < 5) {
          alert('You can only comment once every 5 minutes.');
          setCommentLoading(false);
          return;
        }
      }
      const commentData = {
        name: name.trim() || 'Anonymous',
        comment: filter.clean(newComment.trim()),
        createdAt: Timestamp.now(),
      };
      await addDoc(commentsRef, commentData);
      setComments(prev => [commentData, ...prev]);
      setNewComment('');
      setName('');
      setCommentSuccess(true);
      setTimeout(() => setCommentSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: blog?.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (_) {}
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
        <CircularProgress sx={{ color: '#8b5cf6' }} />
      </Box>
    );
  }

  if (error || !blog) {
    return (
      <Box sx={{ pt: 16, textAlign: 'center' }}>
        <Typography sx={{ color: '#ef4444', fontSize: '1.1rem' }}>{error || 'Article not found.'}</Typography>
        <Button component={Link} to="/articles" sx={{ mt: 2, color: '#8b5cf6' }}>← Back to Articles</Button>
      </Box>
    );
  }

  const catKey = blog.category || '';
  const catStyle = CATEGORY_COLORS[catKey] || { bg: 'rgba(100,116,139,0.1)', color: '#94a3b8', label: catKey || 'Article' };
  const readTime = estimateReadTime(blog.content);
  const date = blog.createdAt?.toDate?.() || new Date();
  const tags = blog.tags || [];

  return (
    <Box sx={{ pt: { xs: 10, md: 12 }, pb: 8 }}>
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* Main article */}
          <Grid item xs={12} md={8}>
            {/* Breadcrumb */}
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 3 }}>
              <Link to="/articles">
                <Typography sx={{ color: '#475569', fontSize: '0.8rem', '&:hover': { color: '#8b5cf6' } }}>Articles</Typography>
              </Link>
              <Typography sx={{ color: '#2d2d45', fontSize: '0.8rem' }}>›</Typography>
              {catKey && (
                <Link to={`/category/${catKey}`}>
                  <Typography sx={{ color: '#475569', fontSize: '0.8rem', '&:hover': { color: '#8b5cf6' } }}>{catStyle.label}</Typography>
                </Link>
              )}
            </Box>

            {/* Category + Meta */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              {catKey && (
                <Chip label={catStyle.label} size="small" sx={{ background: catStyle.bg, color: catStyle.color, fontWeight: 700, fontSize: '0.68rem', letterSpacing: '0.05em', border: 'none' }} />
              )}
              {blog.featured && <Box component="span" className="simba-pick">⚡ Simba's Pick</Box>}
            </Box>

            {/* Title */}
            <Typography
              variant="h1"
              sx={{ color: '#f1f5f9', fontSize: { xs: '1.75rem', md: '2.5rem' }, lineHeight: 1.2, mb: 2.5 }}
            >
              {blog.title}
            </Typography>

            {/* Meta row */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: '#8b5cf6', fontSize: '0.875rem', fontFamily: '"Space Grotesk"', fontWeight: 700 }}>
                {(blog.author || 'S')[0].toUpperCase()}
              </Avatar>
              <Box>
                <Typography sx={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.875rem', lineHeight: 1 }}>{blog.author}</Typography>
                <Typography sx={{ color: '#475569', fontSize: '0.75rem' }}>
                  {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#475569' }}>
                <AccessTimeIcon sx={{ fontSize: '0.85rem' }} />
                <Typography sx={{ fontSize: '0.8rem' }}>{readTime} min read</Typography>
              </Box>
              <Box sx={{ flex: 1 }} />
              <Button
                size="small"
                startIcon={<ShareIcon fontSize="small" />}
                onClick={handleShare}
                sx={{ color: copied ? '#10b981' : '#64748b', fontSize: '0.78rem', '&:hover': { color: '#8b5cf6' } }}
              >
                {copied ? 'Copied!' : 'Share'}
              </Button>
              {currentUser && (
                <Button
                  component={Link}
                  to={`/admin/edit/${id}`}
                  size="small"
                  startIcon={<EditIcon fontSize="small" />}
                  sx={{ color: '#f59e0b', fontSize: '0.78rem', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '8px', px: 1.5, '&:hover': { background: 'rgba(245,158,11,0.08)' } }}
                >
                  Edit
                </Button>
              )}
            </Box>

            {/* Hero image — only renders if src loads; silently omitted if URL fails */}
            {blog.imageUrl && (
              <HeroImage src={blog.imageUrl} alt={blog.imageAlt || blog.title} />
            )}
            )}

            {/* Post summary callout */}
            {blog.postSummary && (
              <Box
                sx={{
                  background: 'rgba(139,92,246,0.07)',
                  border: '1px solid rgba(139,92,246,0.2)',
                  borderLeft: '3px solid #8b5cf6',
                  borderRadius: '0 12px 12px 0',
                  p: 2.5, mb: 4,
                }}
              >
                <Typography sx={{ color: '#a78bfa', fontSize: '1rem', fontStyle: 'italic', lineHeight: 1.65 }}>
                  {blog.postSummary}
                </Typography>
              </Box>
            )}

            {/* Article body */}
            <Box className="article-body">
              <ReactMarkdown>{blog.content}</ReactMarkdown>
            </Box>

            {/* YouTube embed */}
            {blog.videoId && (
              <Box sx={{ mt: 4, mb: 2 }}>
                <Typography sx={{ color: '#64748b', fontWeight: 600, mb: 1.5, fontFamily: '"Space Grotesk"' }}>Featured Video</Typography>
                <Box sx={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid #1e1e30', position: 'relative', pt: '56.25%' }}>
                  <Box
                    component="iframe"
                    src={`https://www.youtube.com/embed/${blog.videoId}`}
                    title="Featured Video"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                  />
                </Box>
              </Box>
            )}

            {/* Tags */}
            {tags.length > 0 && (
              <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #1e1e30', display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                <Typography sx={{ color: '#475569', fontSize: '0.8rem', mr: 0.5 }}>Tags:</Typography>
                {tags.map(tag => (
                  <Link key={tag} to={`/articles?search=${tag}`}>
                    <Chip
                      label={`#${tag}`}
                      size="small"
                      sx={{ background: '#14141f', color: '#64748b', border: '1px solid #1e1e30', fontSize: '0.72rem', cursor: 'pointer', '&:hover': { borderColor: '#8b5cf6', color: '#a78bfa' } }}
                    />
                  </Link>
                ))}
              </Box>
            )}

            <Divider sx={{ my: 5, borderColor: '#1e1e30' }} />

            {/* Comment section */}
            <Box>
              <Typography variant="h5" sx={{ color: '#f1f5f9', fontFamily: '"Space Grotesk"', mb: 3 }}>
                Comments ({comments.length})
              </Typography>
              <Box component="form" onSubmit={handleCommentSubmit} sx={{ mb: 4 }}>
                <Grid container spacing={1.5}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      size="small"
                      fullWidth
                      placeholder="Your name (optional)"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <TextField
                      size="small"
                      fullWidth
                      multiline
                      rows={3}
                      placeholder="Leave a comment…"
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="small"
                      disabled={commentLoading || !newComment.trim()}
                    >
                      {commentLoading ? 'Posting…' : commentSuccess ? '✓ Posted!' : 'Post Comment'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {comments.length === 0 ? (
                  <Typography sx={{ color: '#475569', fontSize: '0.875rem' }}>
                    No comments yet. Be the first to drop one.
                  </Typography>
                ) : (
                  comments.map((c, i) => (
                    <Box
                      key={i}
                      sx={{ display: 'flex', gap: 2, p: 2, background: '#0f0f1a', border: '1px solid #1e1e30', borderRadius: '12px' }}
                    >
                      <Avatar sx={{ width: 34, height: 34, bgcolor: '#1e1e30', color: '#8b5cf6', fontSize: '0.875rem', fontFamily: '"Space Grotesk"', fontWeight: 700, flexShrink: 0 }}>
                        {(c.name || 'A')[0].toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography sx={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.875rem' }}>{c.name || 'Anonymous'}</Typography>
                        <Typography sx={{ color: '#94a3b8', fontSize: '0.875rem', mt: 0.25, lineHeight: 1.65 }}>{c.comment}</Typography>
                      </Box>
                    </Box>
                  ))
                )}
              </Box>
            </Box>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Box sx={{ position: 'sticky', top: 88, display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Related posts */}
              {relatedBlogs.length > 0 && (
                <Box sx={{ background: '#0f0f1a', border: '1px solid #1e1e30', borderRadius: '16px', p: 2.5 }}>
                  <Typography sx={{ color: '#f1f5f9', fontFamily: '"Space Grotesk"', fontWeight: 700, mb: 2, fontSize: '0.95rem' }}>
                    Read Next
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {relatedBlogs.map(rb => (
                      <ArticleCard key={rb.id} article={rb} variant="compact" />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Newsletter */}
              <NewsletterSignup variant="drop" />

              {/* Back link */}
              <Button
                component={Link}
                to="/articles"
                variant="outlined"
                fullWidth
                sx={{ borderColor: '#1e1e30', color: '#64748b', '&:hover': { borderColor: '#8b5cf6', color: '#8b5cf6' } }}
              >
                ← Back to Articles
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default BlogPage;
