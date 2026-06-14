import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Grid, Typography, Divider, IconButton } from '@mui/material';

const CATEGORIES = [
  { label: 'Power Rankings', to: '/category/power-rankings' },
  { label: 'Collector Guides', to: '/category/collector-guides' },
  { label: 'Nostalgia Vault', to: '/category/nostalgia-vault' },
  { label: 'Card of the Week', to: '/category/card-of-the-week' },
  { label: 'Battle Debate', to: '/category/battle-debate' },
  { label: 'Beginner Guides', to: '/category/beginner-guides' },
];

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        background: '#0a0a12',
        borderTop: '1px solid #1e1e30',
        pt: 6,
        pb: 4,
        mt: 'auto',
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {/* Brand */}
          <Grid item xs={12} md={4}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '9px',
                  background: 'linear-gradient(135deg, #8b5cf6, #f59e0b)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                }}
              >
                ⚡
              </Box>
              <Box sx={{ fontFamily: '"Space Grotesk"', fontWeight: 700, fontSize: '1.1rem', color: '#f1f5f9' }}>
                Simba<Box component="span" sx={{ color: '#8b5cf6' }}>Verse</Box>
              </Box>
            </Link>
            <Typography variant="body2" sx={{ color: '#475569', maxWidth: 300, lineHeight: 1.7 }}>
              The premium hub for anime culture, trading card collecting, and limited collectible drops. Built for adults who grew up on Toonami.
            </Typography>
          </Grid>

          {/* Categories */}
          <Grid item xs={6} md={2}>
            <Typography
              variant="overline"
              sx={{ color: '#475569', display: 'block', mb: 1.5, fontSize: '0.68rem', letterSpacing: '0.1em' }}
            >
              Categories
            </Typography>
            {CATEGORIES.map((cat) => (
              <Box key={cat.to} sx={{ mb: 0.75 }}>
                <Link to={cat.to}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#64748b',
                      '&:hover': { color: '#8b5cf6' },
                      transition: 'color 0.15s',
                      fontSize: '0.825rem',
                    }}
                  >
                    {cat.label}
                  </Typography>
                </Link>
              </Box>
            ))}
          </Grid>

          {/* Site */}
          <Grid item xs={6} md={2}>
            <Typography
              variant="overline"
              sx={{ color: '#475569', display: 'block', mb: 1.5, fontSize: '0.68rem', letterSpacing: '0.1em' }}
            >
              Site
            </Typography>
            {[
              { label: 'All Articles', to: '/articles' },
              { label: 'Drops', to: '/drops' },
              { label: 'About', to: '/about' },
            ].map((link) => (
              <Box key={link.to} sx={{ mb: 0.75 }}>
                <Link to={link.to}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#64748b',
                      '&:hover': { color: '#8b5cf6' },
                      transition: 'color 0.15s',
                      fontSize: '0.825rem',
                    }}
                  >
                    {link.label}
                  </Typography>
                </Link>
              </Box>
            ))}
          </Grid>

          {/* Newsletter */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="overline"
              sx={{ color: '#475569', display: 'block', mb: 1.5, fontSize: '0.68rem', letterSpacing: '0.1em' }}
            >
              Join the Drop List
            </Typography>
            <Typography variant="body2" sx={{ color: '#475569', mb: 2, lineHeight: 1.65, fontSize: '0.825rem' }}>
              Be first to know when new drops go live. No spam — just rare releases and culture drops.
            </Typography>
            <Box
              component="form"
              onSubmit={(e) => e.preventDefault()}
              sx={{ display: 'flex', gap: 1 }}
            >
              <Box
                component="input"
                type="email"
                placeholder="you@example.com"
                sx={{
                  flex: 1,
                  background: '#14141f',
                  border: '1px solid #1e1e30',
                  borderRadius: '8px',
                  px: 1.5,
                  py: 1,
                  color: '#f1f5f9',
                  fontSize: '0.825rem',
                  fontFamily: 'Inter, sans-serif',
                  outline: 'none',
                  '&:focus': { borderColor: '#8b5cf6' },
                  '&::placeholder': { color: '#475569' },
                }}
              />
              <Box
                component="button"
                type="submit"
                sx={{
                  background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  px: 2,
                  py: 1,
                  fontSize: '0.8rem',
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  '&:hover': { opacity: 0.9 },
                }}
              >
                Notify Me
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: '#1e1e30', mb: 3 }} />

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 1.5 }}>
          <Typography variant="body2" sx={{ color: '#334155', fontSize: '0.75rem' }}>
            © {new Date().getFullYear()} SimbaVerse. All rights reserved.
          </Typography>
          <Typography variant="body2" sx={{ color: '#334155', fontSize: '0.7rem', maxWidth: 580, textAlign: { sm: 'right' }, lineHeight: 1.5 }}>
            Independent culture & collectibles site. Not affiliated with or endorsed by any anime, gaming, or entertainment rights holders mentioned in editorial content.
          </Typography>
        </Box>

        {/* Hidden admin link */}
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Link to="/login">
            <Typography variant="body2" sx={{ color: '#1e1e30', fontSize: '0.7rem', '&:hover': { color: '#475569' }, transition: 'color 0.2s' }}>
              admin
            </Typography>
          </Link>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
