import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useParams } from 'react-router-dom';
import {
  Box, Container, Grid, Typography, Button, CircularProgress,
  TextField, InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArticleCard from './ArticleCard';

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'power-rankings', label: '⚡ Power Rankings' },
  { key: 'collector-guides', label: '🃏 Collector Guides' },
  { key: 'nostalgia-vault', label: '📼 Nostalgia Vault' },
  { key: 'card-of-the-week', label: '🎴 Card of the Week' },
  { key: 'battle-debate', label: '⚔️ Battle Debate' },
  { key: 'beginner-guides', label: '📖 Beginner Guides' },
  { key: 'drop-story', label: '🎁 Drop Story' },
  { key: 'display-setup', label: '🖼 Display Setup' },
  { key: 'worth-it', label: '🤔 Worth It?' },
];

const BlogList = () => {
  const { category } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeCategory, setActiveCategory] = useState(category || 'all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setBlogs(data);
        setFiltered(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load articles.');
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  useEffect(() => {
    let result = blogs;
    if (activeCategory !== 'all') {
      result = result.filter(b => b.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(b =>
        b.title?.toLowerCase().includes(q) ||
        b.postSummary?.toLowerCase().includes(q) ||
        b.author?.toLowerCase().includes(q) ||
        b.tags?.some(t => t.toLowerCase().includes(q))
      );
    }
    setFiltered(result);
  }, [activeCategory, search, blogs]);

  useEffect(() => {
    if (category) setActiveCategory(category);
  }, [category]);

  const catInfo = CATEGORIES.find(c => c.key === activeCategory);

  return (
    <Box sx={{ pt: { xs: 10, md: 12 }, pb: 8 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="overline" sx={{ color: '#8b5cf6', fontSize: '0.7rem', letterSpacing: '0.14em', display: 'block', mb: 1 }}>
            {activeCategory !== 'all' ? 'Category' : 'Archive'}
          </Typography>
          <Typography variant="h3" sx={{ color: '#f1f5f9', mb: 1, fontSize: { xs: '1.8rem', md: '2.4rem' } }}>
            {activeCategory !== 'all' ? (catInfo?.label || activeCategory) : 'All Articles'}
          </Typography>
          <Typography sx={{ color: '#64748b', fontSize: '0.9rem' }}>
            {filtered.length} {filtered.length === 1 ? 'article' : 'articles'}{activeCategory !== 'all' ? ` in this category` : ''}
          </Typography>
        </Box>

        {/* Search + Category filter */}
        <Box sx={{ mb: 4, display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
          <TextField
            size="small"
            placeholder="Search articles…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#475569', fontSize: '1.1rem' }} /></InputAdornment>,
            }}
            sx={{ minWidth: 240, maxWidth: { sm: 320 } }}
          />
        </Box>

        {/* Category tabs */}
        <Box sx={{ display: 'flex', gap: 1, mb: 5, overflowX: 'auto', pb: 0.5, '&::-webkit-scrollbar': { height: 0 } }}>
          {CATEGORIES.map(cat => (
            <Button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              size="small"
              sx={{
                whiteSpace: 'nowrap',
                px: 1.75,
                py: 0.75,
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.78rem',
                background: activeCategory === cat.key ? 'rgba(139,92,246,0.15)' : 'transparent',
                color: activeCategory === cat.key ? '#a78bfa' : '#64748b',
                border: `1px solid ${activeCategory === cat.key ? 'rgba(139,92,246,0.4)' : '#1e1e30'}`,
                '&:hover': { background: 'rgba(139,92,246,0.08)', color: '#a78bfa' },
              }}
            >
              {cat.label}
            </Button>
          ))}
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress sx={{ color: '#8b5cf6' }} />
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography sx={{ color: '#ef4444' }}>{error}</Typography>
          </Box>
        ) : filtered.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10, border: '1px solid #1e1e30', borderRadius: '20px', background: '#0f0f1a' }}>
            <Typography sx={{ fontSize: '2.5rem', mb: 2 }}>🔍</Typography>
            <Typography sx={{ color: '#f1f5f9', fontFamily: '"Space Grotesk"', fontWeight: 700, mb: 1 }}>
              Nothing found
            </Typography>
            <Typography sx={{ color: '#64748b', fontSize: '0.875rem' }}>
              Try a different search or category.
            </Typography>
            <Button sx={{ mt: 2, color: '#8b5cf6' }} onClick={() => { setSearch(''); setActiveCategory('all'); }}>
              Clear filters
            </Button>
          </Box>
        ) : (
          <Grid container spacing={2.5}>
            {filtered.map(blog => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={blog.id}>
                <ArticleCard article={blog} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default BlogList;
