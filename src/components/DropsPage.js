import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Box, Container, Grid, Typography, Button, CircularProgress } from '@mui/material';
import DropCard from './DropCard';
import NewsletterSignup from './NewsletterSignup';

const STATUS_TABS = [
  { key: 'all', label: 'All Drops' },
  { key: 'live', label: '🟢 Live Now' },
  { key: 'upcoming', label: '⏳ Upcoming' },
  { key: 'sold-out', label: '🔴 Sold Out' },
  { key: 'archived', label: '🗄 Vaulted' },
];

const DropsPage = () => {
  const [drops, setDrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchDrops = async () => {
      try {
        const snap = await getDocs(query(collection(db, 'drops'), orderBy('createdAt', 'desc')));
        setDrops(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error('Drops fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDrops();
  }, []);

  const filtered = activeTab === 'all' ? drops : drops.filter(d => d.status === activeTab);
  const liveDrops = drops.filter(d => d.status === 'live');
  const upcomingDrops = drops.filter(d => d.status === 'upcoming');

  return (
    <Box sx={{ pt: { xs: 10, md: 12 }, pb: 8 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="overline" sx={{ color: '#f59e0b', fontSize: '0.7rem', letterSpacing: '0.14em', display: 'block', mb: 1 }}>
            Limited Releases
          </Typography>
          <Typography variant="h2" sx={{ color: '#f1f5f9', fontSize: { xs: '2rem', md: '3rem' }, mb: 2 }}>
            The Drop Archive
          </Typography>
          <Typography sx={{ color: '#64748b', maxWidth: 560, lineHeight: 1.75 }}>
            Original collectibles, display pieces, and limited edition culture drops. Each release ships with a story card and collector notes. Numbers are real — when it's gone, it's vaulted.
          </Typography>
        </Box>

        {/* Live alert banner */}
        {liveDrops.length > 0 && (
          <Box
            sx={{
              mb: 5,
              background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(6,182,212,0.06))',
              border: '1px solid rgba(16,185,129,0.3)',
              borderRadius: '16px',
              p: { xs: 2.5, md: 3 },
              display: 'flex',
              alignItems: { sm: 'center' },
              gap: 2,
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981', flexShrink: 0, animation: 'pulse 1.5s ease-in-out infinite' }} />
              <Typography sx={{ color: '#34d399', fontFamily: '"Space Grotesk"', fontWeight: 700, fontSize: '0.95rem' }}>
                {liveDrops.length} Drop{liveDrops.length > 1 ? 's' : ''} Live Right Now
              </Typography>
            </Box>
            <Typography sx={{ color: '#64748b', fontSize: '0.875rem', flex: 1 }}>
              {liveDrops.map(d => d.name).join(', ')} — limited quantities available.
            </Typography>
          </Box>
        )}

        {/* Tab filter */}
        <Box sx={{ display: 'flex', gap: 1, mb: 5, overflowX: 'auto', pb: 0.5, '&::-webkit-scrollbar': { height: 0 } }}>
          {STATUS_TABS.map(tab => (
            <Button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              size="small"
              sx={{
                whiteSpace: 'nowrap',
                px: 2, py: 0.75,
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.78rem',
                background: activeTab === tab.key ? 'rgba(245,158,11,0.12)' : 'transparent',
                color: activeTab === tab.key ? '#fbbf24' : '#64748b',
                border: `1px solid ${activeTab === tab.key ? 'rgba(245,158,11,0.35)' : '#1e1e30'}`,
                '&:hover': { background: 'rgba(245,158,11,0.08)', color: '#fbbf24' },
              }}
            >
              {tab.label}
            </Button>
          ))}
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress sx={{ color: '#8b5cf6' }} />
          </Box>
        ) : filtered.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center', py: 10, border: '1px solid #1e1e30',
              borderRadius: '20px', background: '#0f0f1a',
            }}
          >
            <Typography sx={{ fontSize: '2.5rem', mb: 2 }}>🎴</Typography>
            <Typography sx={{ color: '#f1f5f9', fontFamily: '"Space Grotesk"', fontWeight: 700, fontSize: '1.1rem', mb: 1 }}>
              {activeTab === 'all' ? 'First drop is being packaged' : 'Nothing in this category yet'}
            </Typography>
            <Typography sx={{ color: '#64748b', fontSize: '0.875rem', mb: 3 }}>
              Get on the list to be first to know when drops go live.
            </Typography>
            <Box sx={{ maxWidth: 360, mx: 'auto' }}>
              <NewsletterSignup variant="drop" />
            </Box>
          </Box>
        ) : (
          <Grid container spacing={2.5}>
            {filtered.map(drop => (
              <Grid item xs={12} sm={6} md={4} key={drop.id}>
                <DropCard drop={drop} />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Drop culture blurb */}
        <Box sx={{ mt: 8, pt: 6, borderTop: '1px solid #1e1e30' }}>
          <Grid container spacing={4}>
            {[
              { icon: '🎴', title: 'Limited Edition', body: 'Every drop has a fixed edition size. When they\'re gone, they\'re vaulted — no restocks.' },
              { icon: '📦', title: 'Display Ready', body: 'Each piece is packaged for display, not just shipping. Comes with collector notes and a story card.' },
              { icon: '⚡', title: 'Original Designs', body: 'All SimbaVerse products feature original artwork. Inspired by anime culture, 100% our own.' },
            ].map(item => (
              <Grid item xs={12} md={4} key={item.title}>
                <Box sx={{ p: 3, border: '1px solid #1e1e30', borderRadius: '16px', background: '#0f0f1a' }}>
                  <Typography sx={{ fontSize: '2rem', mb: 1.5 }}>{item.icon}</Typography>
                  <Typography sx={{ color: '#f1f5f9', fontFamily: '"Space Grotesk"', fontWeight: 700, mb: 0.75 }}>{item.title}</Typography>
                  <Typography sx={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.7 }}>{item.body}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Newsletter */}
        <Box sx={{ mt: 6 }}>
          <NewsletterSignup variant="banner" />
        </Box>
      </Container>
    </Box>
  );
};

export default DropsPage;
