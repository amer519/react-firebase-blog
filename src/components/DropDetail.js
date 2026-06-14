import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import {
  Box, Container, Grid, Typography, Button, CircularProgress,
  Chip, Divider, LinearProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CountdownTimer from './CountdownTimer';
import NewsletterSignup from './NewsletterSignup';

const DetailImage = ({ src, alt }) => {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #14141f 0%, #1a0533 100%)' }}>
        <Typography sx={{ fontSize: '5rem', opacity: 0.15, userSelect: 'none' }}>🎴</Typography>
      </Box>
    );
  }
  return (
    <Box
      component="img"
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
    />
  );
};
const STATUS_CONFIG = {
  upcoming: { label: 'Dropping Soon', bg: 'rgba(245, 158, 11, 0.12)', color: '#fbbf24', border: 'rgba(245,158,11,0.3)' },
  live: { label: 'Live Now', bg: 'rgba(16, 185, 129, 0.12)', color: '#34d399', border: 'rgba(16,185,129,0.3)' },
  'sold-out': { label: 'Sold Out', bg: 'rgba(100, 116, 139, 0.1)', color: '#64748b', border: '#1e1e30' },
  archived: { label: 'Vaulted', bg: 'rgba(51, 65, 85, 0.1)', color: '#334155', border: '#1a1a2e' },
};

const DropDetail = () => {
  const { id } = useParams();
  const [drop, setDrop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchDrop = async () => {
      try {
        const snap = await getDoc(doc(db, 'drops', id));
        if (snap.exists()) {
          setDrop({ id: snap.id, ...snap.data() });
        } else {
          setError('Drop not found.');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load drop.');
      } finally {
        setLoading(false);
      }
    };
    fetchDrop();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
        <CircularProgress sx={{ color: '#8b5cf6' }} />
      </Box>
    );
  }

  if (error || !drop) {
    return (
      <Box sx={{ pt: 16, textAlign: 'center' }}>
        <Typography sx={{ color: '#ef4444' }}>{error || 'Drop not found.'}</Typography>
        <Button component={Link} to="/drops" sx={{ mt: 2, color: '#8b5cf6' }}>← Back to Drops</Button>
      </Box>
    );
  }

  const statusCfg = STATUS_CONFIG[drop.status] || STATUS_CONFIG.upcoming;
  const images = drop.imageUrls?.length ? drop.imageUrls : (drop.imageUrl ? [drop.imageUrl] : []);
  const dropDate = drop.dropDate?.toDate?.() || (drop.dropDate ? new Date(drop.dropDate) : null);
  const stockPct = drop.editionSize > 0 ? ((drop.stockRemaining ?? drop.editionSize) / drop.editionSize) * 100 : 100;
  const variants = drop.variants || [];
  const tags = drop.tags || [];

  return (
    <Box sx={{ pt: { xs: 10, md: 12 }, pb: 8 }}>
      <Container maxWidth="xl">
        {/* Back */}
        <Button
          component={Link}
          to="/drops"
          startIcon={<ArrowBackIcon fontSize="small" />}
          sx={{ color: '#64748b', mb: 4, fontSize: '0.8rem', '&:hover': { color: '#8b5cf6' } }}
        >
          All Drops
        </Button>

        <Grid container spacing={5}>
          {/* Images */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                borderRadius: '20px', overflow: 'hidden', border: '1px solid #1e1e30',
                background: '#0f0f1a', mb: 1.5, aspectRatio: '1/1',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <DetailImage src={images[activeImage]} alt={drop.name} />
            </Box>
            {images.length > 1 && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                {images.map((img, i) => (
                  <Box
                    key={i}
                    component="img"
                    src={img}
                    alt={`${drop.name} view ${i + 1}`}
                    onClick={() => setActiveImage(i)}
                    sx={{
                      width: 64, height: 64, objectFit: 'cover', borderRadius: '10px',
                      border: `2px solid ${i === activeImage ? '#8b5cf6' : '#1e1e30'}`,
                      cursor: 'pointer', transition: 'border-color 0.2s',
                    }}
                  />
                ))}
              </Box>
            )}
          </Grid>

          {/* Details */}
          <Grid item xs={12} md={6}>
            {/* Status */}
            <Box
              sx={{
                display: 'inline-flex', alignItems: 'center', gap: 1,
                background: statusCfg.bg, border: `1px solid ${statusCfg.border}`,
                borderRadius: '8px', px: 1.5, py: 0.6, mb: 2,
              }}
            >
              {drop.status === 'live' && (
                <Box sx={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981', animation: 'pulse 1.5s ease-in-out infinite' }} />
              )}
              <Typography sx={{ color: statusCfg.color, fontFamily: '"Space Grotesk"', fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.06em' }}>
                {statusCfg.label}
              </Typography>
            </Box>

            <Typography variant="h2" sx={{ color: '#f1f5f9', fontSize: { xs: '1.8rem', md: '2.4rem' }, lineHeight: 1.15, mb: 1 }}>
              {drop.name}
            </Typography>

            {/* Edition info */}
            <Box sx={{ display: 'flex', gap: 1.5, mb: 2.5, flexWrap: 'wrap' }}>
              {drop.editionSize > 0 && (
                <Chip
                  label={`Edition of ${drop.editionSize}`}
                  size="small"
                  sx={{ background: 'rgba(245,158,11,0.1)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.25)', fontWeight: 700, fontSize: '0.7rem' }}
                />
              )}
              {drop.displayReady && (
                <Chip label="Display Ready" size="small" sx={{ background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.25)', fontWeight: 700, fontSize: '0.7rem' }} />
              )}
              {drop.includesStoryCard && (
                <Chip label="Includes Story Card" size="small" sx={{ background: 'rgba(6,182,212,0.1)', color: '#22d3ee', border: '1px solid rgba(6,182,212,0.25)', fontWeight: 700, fontSize: '0.7rem' }} />
              )}
            </Box>

            {drop.description && (
              <Typography sx={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.75, mb: 3 }}>
                {drop.description}
              </Typography>
            )}

            {/* Countdown */}
            {drop.status === 'upcoming' && dropDate && (
              <Box sx={{ mb: 3 }}>
                <CountdownTimer targetDate={dropDate} size="md" />
              </Box>
            )}

            {/* Stock bar */}
            {drop.editionSize > 0 && (drop.status === 'live' || drop.status === 'sold-out') && (
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                  <Typography sx={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 600 }}>Availability</Typography>
                  <Typography sx={{ color: '#f59e0b', fontSize: '0.8rem', fontWeight: 700 }}>
                    {drop.status === 'sold-out' ? 'Sold Out' : `${drop.stockRemaining ?? drop.editionSize} of ${drop.editionSize} remaining`}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={drop.status === 'sold-out' ? 0 : stockPct}
                  sx={{
                    height: 6, borderRadius: 3, background: '#1e1e30',
                    '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #8b5cf6, #f59e0b)', borderRadius: 3 },
                  }}
                />
              </Box>
            )}

            {/* Price + CTA */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
              <Typography sx={{ color: '#f1f5f9', fontFamily: '"Space Grotesk"', fontWeight: 800, fontSize: '2rem' }}>
                {drop.price ? `$${drop.price.toFixed(2)}` : 'TBA'}
              </Typography>
              {variants.length > 0 && (
                <Typography sx={{ color: '#475569', fontSize: '0.8rem' }}>
                  {variants.map(v => v.name).join(' · ')}
                </Typography>
              )}
            </Box>

            {drop.status === 'live' ? (
              <Button
                variant="contained"
                size="large"
                fullWidth
                sx={{
                  background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                  boxShadow: '0 6px 24px rgba(139,92,246,0.4)',
                  fontSize: '1rem',
                  py: 1.5,
                  mb: 1.5,
                }}
              >
                Add to Cart — ${drop.price?.toFixed(2) || 'TBA'}
              </Button>
            ) : drop.status === 'upcoming' ? (
              <Box sx={{ mb: 1.5 }}>
                <NewsletterSignup variant="drop" dropId={id} />
              </Box>
            ) : (
              <Box
                sx={{
                  background: '#14141f', border: '1px solid #1e1e30', borderRadius: '12px',
                  p: 2.5, mb: 1.5, textAlign: 'center',
                }}
              >
                <Typography sx={{ color: '#475569', fontFamily: '"Space Grotesk"', fontWeight: 600 }}>
                  {drop.status === 'sold-out' ? '🔴 This drop is sold out and vaulted.' : '🗄 This drop has been vaulted.'}
                </Typography>
              </Box>
            )}

            <Typography sx={{ color: '#334155', fontSize: '0.72rem', textAlign: 'center' }}>
              Payments powered by Stripe. Secure checkout coming soon.
            </Typography>

            <Divider sx={{ my: 3, borderColor: '#1e1e30' }} />

            {/* Collector notes */}
            {drop.collectorNotes && (
              <Box sx={{ mb: 3 }}>
                <Typography sx={{ color: '#64748b', fontFamily: '"Space Grotesk"', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase', mb: 1 }}>
                  Collector Notes
                </Typography>
                <Typography sx={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.7 }}>
                  {drop.collectorNotes}
                </Typography>
              </Box>
            )}

            {tags.length > 0 && (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {tags.map(tag => (
                  <Chip key={tag} label={`#${tag}`} size="small" sx={{ background: '#14141f', color: '#475569', border: '1px solid #1e1e30', fontSize: '0.7rem' }} />
                ))}
              </Box>
            )}
          </Grid>
        </Grid>

        {/* Drop Story */}
        {drop.dropStory && (
          <Box sx={{ mt: 8 }}>
            <Divider sx={{ borderColor: '#1e1e30', mb: 6 }} />
            <Box sx={{ maxWidth: 720, mx: 'auto' }}>
              <Typography variant="overline" sx={{ color: '#8b5cf6', fontSize: '0.7rem', letterSpacing: '0.14em', display: 'block', mb: 1 }}>
                Drop Story
              </Typography>
              <Typography variant="h4" sx={{ color: '#f1f5f9', mb: 4 }}>
                The Story Behind This Drop
              </Typography>
              <Box className="article-body">
                <Typography sx={{ color: '#94a3b8', lineHeight: 1.85, whiteSpace: 'pre-wrap' }}>
                  {drop.dropStory}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        {/* Newsletter */}
        <Box sx={{ mt: 8 }}>
          <NewsletterSignup variant="banner" />
        </Box>
      </Container>
    </Box>
  );
};

export default DropDetail;
