import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Box, Container, Grid, Typography, Button, CircularProgress, Divider } from '@mui/material';
import ArticleCard from './ArticleCard';
import DropCard from './DropCard';
import NewsletterSignup from './NewsletterSignup';
import PollWidget from './PollWidget';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const LANES = [
  { icon: '🃏', title: 'Trading Cards', subtitle: 'Pull rates, grades & the hunt', to: '/category/collector-guides', color: '#f59e0b' },
  { icon: '⚡', title: 'Power Rankings', subtitle: 'Who wins? The data decides', to: '/category/power-rankings', color: '#8b5cf6' },
  { icon: '📼', title: 'Nostalgia Vault', subtitle: 'Toonami-era deep cuts', to: '/category/nostalgia-vault', color: '#06b6d4' },
  { icon: '📖', title: 'Collector Guides', subtitle: 'Start smart, collect right', to: '/category/collector-guides', color: '#10b981' },
  { icon: '🎴', title: 'Limited Drops', subtitle: 'Rare releases, vault pieces', to: '/drops', color: '#ef4444' },
];

const SectionLabel = ({ children, color = '#8b5cf6' }) => (
  <Typography variant="overline" sx={{ color, fontSize: '0.7rem', letterSpacing: '0.14em', display: 'block', mb: 1 }}>
    {children}
  </Typography>
);

const SectionHeading = ({ children, action, actionTo }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 3 }}>
    <Typography variant="h5" sx={{ color: '#f1f5f9', fontFamily: '"Space Grotesk"', fontWeight: 700, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
      {children}
    </Typography>
    {action && (
      <Button component={Link} to={actionTo} endIcon={<ArrowForwardIcon fontSize="small" />} sx={{ color: '#64748b', fontSize: '0.8rem', '&:hover': { color: '#8b5cf6' } }}>
        {action}
      </Button>
    )}
  </Box>
);

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [drops, setDrops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postSnap, dropSnap] = await Promise.all([
          getDocs(query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(7))),
          getDocs(query(collection(db, 'drops'), orderBy('createdAt', 'desc'), limit(3))).catch(() => ({ docs: [] })),
        ]);
        setArticles(postSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        setDrops(dropSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const heroArticle = articles[0] || null;
  const featuredArticles = articles.slice(1, 4);
  const latestArticles = articles.slice(4, 7);

  return (
    <Box>
      {/* ── Hero ─────────────────────────────────────────── */}
      <Box
        sx={{
          background: 'linear-gradient(180deg, rgba(139,92,246,0.06) 0%, transparent 100%)',
          borderBottom: '1px solid #1e1e30',
          pt: { xs: 10, md: 12 },
          pb: { xs: 6, md: 8 },
        }}
      >
        <Container maxWidth="xl">
          {/* Headline */}
          <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 7 } }}>
            <Box
              sx={{
                display: 'inline-flex', alignItems: 'center', gap: 1,
                background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)',
                borderRadius: '100px', px: 2, py: 0.75, mb: 3,
              }}
            >
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#8b5cf6', boxShadow: '0 0 8px #8b5cf6' }} />
              <Typography sx={{ color: '#a78bfa', fontSize: '0.78rem', fontFamily: '"Space Grotesk"', fontWeight: 600, letterSpacing: '0.06em' }}>
                New drops & rankings every week
              </Typography>
            </Box>
            <Typography
              variant="h1"
              sx={{
                color: '#f1f5f9',
                fontSize: { xs: '2.2rem', sm: '3rem', md: '4rem' },
                lineHeight: 1.1,
                mb: 2,
                maxWidth: 760,
                mx: 'auto',
              }}
            >
              Where Collectors &{' '}
              <Box component="span" sx={{ background: 'linear-gradient(135deg, #8b5cf6, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Anime Fans
              </Box>{' '}
              Level Up
            </Typography>
            <Typography sx={{ color: '#64748b', fontSize: { xs: '1rem', md: '1.1rem' }, maxWidth: 520, mx: 'auto', lineHeight: 1.7 }}>
              Power rankings, rare drops, collector guides, and Toonami-era nostalgia. Built for adults who grew up on the good stuff.
            </Typography>
          </Box>

          {/* Hero article + sidebar */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress sx={{ color: '#8b5cf6' }} /></Box>
          ) : heroArticle ? (
            <Grid container spacing={3}>
              <Grid item xs={12} md={7}>
                <ArticleCard article={heroArticle} variant="hero" />
              </Grid>
              <Grid item xs={12} md={5}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, height: '100%' }}>
                  {featuredArticles.map(a => (
                    <ArticleCard key={a.id} article={a} variant="compact" />
                  ))}
                </Box>
              </Grid>
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8, color: '#475569' }}>
              <Typography sx={{ fontSize: '3rem', mb: 2 }}>⚡</Typography>
              <Typography>First posts coming soon — check back shortly.</Typography>
            </Box>
          )}
        </Container>
      </Box>

      {/* ── Choose Your Lane ─────────────────────────────── */}
      <Box sx={{ py: { xs: 6, md: 8 }, borderBottom: '1px solid #1e1e30' }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <SectionLabel>Navigate</SectionLabel>
            <Typography variant="h4" sx={{ color: '#f1f5f9' }}>Choose Your Lane</Typography>
          </Box>
          <Grid container spacing={2}>
            {LANES.map((lane) => (
              <Grid item xs={6} sm={4} md={12 / 5} key={lane.to + lane.title}>
                <Link to={lane.to} style={{ display: 'block', textDecoration: 'none' }}>
                  <Box
                    sx={{
                      border: '1px solid #1e1e30', borderRadius: '16px', background: '#0f0f1a',
                      p: { xs: 2, md: 2.5 }, textAlign: 'center', cursor: 'pointer',
                      '&:hover': { borderColor: lane.color, background: `${lane.color}08`, transform: 'translateY(-2px)' },
                      transition: 'all 0.25s',
                    }}
                  >
                    <Typography sx={{ fontSize: { xs: '1.8rem', md: '2.2rem' }, mb: 1 }}>{lane.icon}</Typography>
                    <Typography sx={{ color: '#f1f5f9', fontFamily: '"Space Grotesk"', fontWeight: 700, fontSize: { xs: '0.875rem', md: '0.95rem' }, lineHeight: 1.2, mb: 0.5 }}>
                      {lane.title}
                    </Typography>
                    <Typography sx={{ color: '#475569', fontSize: '0.75rem', lineHeight: 1.4 }}>
                      {lane.subtitle}
                    </Typography>
                  </Box>
                </Link>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── Latest Articles ───────────────────────────────── */}
      {latestArticles.length > 0 && (
        <Box sx={{ py: { xs: 6, md: 8 }, borderBottom: '1px solid #1e1e30' }}>
          <Container maxWidth="xl">
            <SectionLabel>Fresh Reads</SectionLabel>
            <SectionHeading action="All Articles" actionTo="/articles">Latest from SimbaVerse</SectionHeading>
            <Grid container spacing={2.5}>
              {latestArticles.map(a => (
                <Grid item xs={12} sm={6} md={4} key={a.id}>
                  <ArticleCard article={a} />
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}

      {/* ── Drops ────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 6, md: 8 }, background: 'linear-gradient(180deg, rgba(139,92,246,0.04) 0%, transparent 100%)', borderBottom: '1px solid #1e1e30' }}>
        <Container maxWidth="xl">
          <SectionLabel color="#f59e0b">Limited Releases</SectionLabel>
          <SectionHeading action="All Drops" actionTo="/drops">Current & Upcoming Drops</SectionHeading>
          {drops.length > 0 ? (
            <Grid container spacing={2.5}>
              {drops.map(d => (
                <Grid item xs={12} sm={6} md={4} key={d.id}>
                  <DropCard drop={d} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box
              sx={{
                border: '1px solid #1e1e30', borderRadius: '20px',
                p: { xs: 4, md: 6 }, textAlign: 'center',
                background: 'linear-gradient(135deg, rgba(139,92,246,0.06), rgba(245,158,11,0.04))',
              }}
            >
              <Typography sx={{ fontSize: '2.5rem', mb: 2 }}>🎴</Typography>
              <Typography sx={{ color: '#f1f5f9', fontFamily: '"Space Grotesk"', fontWeight: 700, fontSize: '1.2rem', mb: 1 }}>
                Something's Brewing
              </Typography>
              <Typography sx={{ color: '#64748b', mb: 3, maxWidth: 400, mx: 'auto' }}>
                The next drop is being packaged. Get on the list to be first to know.
              </Typography>
              <Button component={Link} to="/drops" variant="contained" size="small">
                View Drop Archive
              </Button>
            </Box>
          )}
        </Container>
      </Box>

      {/* ── Battle Debate + Newsletter ────────────────────── */}
      <Box sx={{ py: { xs: 6, md: 8 }, borderBottom: '1px solid #1e1e30' }}>
        <Container maxWidth="xl">
          <Grid container spacing={4} alignItems="stretch">
            <Grid item xs={12} md={5}>
              <SectionLabel>Community</SectionLabel>
              <Typography variant="h5" sx={{ color: '#f1f5f9', mb: 3, fontFamily: '"Space Grotesk"', fontWeight: 700 }}>
                Cast Your Vote
              </Typography>
              <PollWidget />
            </Grid>
            <Grid item xs={12} md={1} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
              <Divider orientation="vertical" sx={{ borderColor: '#1e1e30' }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <SectionLabel color="#f59e0b">Stay Connected</SectionLabel>
              <Typography variant="h5" sx={{ color: '#f1f5f9', mb: 1.5, fontFamily: '"Space Grotesk"', fontWeight: 700 }}>
                The Drop List
              </Typography>
              <Typography sx={{ color: '#64748b', mb: 3, fontSize: '0.9rem', lineHeight: 1.7 }}>
                Limited drops, power rankings, and collector content — delivered when it matters. No spam, ever.
              </Typography>
              <Box
                sx={{
                  background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(245,158,11,0.06))',
                  border: '1px solid rgba(139,92,246,0.2)',
                  borderRadius: '16px',
                  p: 3,
                }}
              >
                <Box sx={{ display: 'flex', gap: 2, mb: 2.5, flexWrap: 'wrap' }}>
                  {['🎴 Card drops', '⚡ Power rankings', '📼 Nostalgia cuts', '🏆 Collector tips'].map(item => (
                    <Typography key={item} sx={{ color: '#64748b', fontSize: '0.8rem' }}>{item}</Typography>
                  ))}
                </Box>
                <NewsletterSignup />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── Newsletter Banner ─────────────────────────────── */}
      <Box sx={{ py: { xs: 6, md: 8 } }}>
        <Container maxWidth="xl">
          <NewsletterSignup variant="banner" />
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
