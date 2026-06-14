import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Grid, Typography, Button, Divider } from '@mui/material';
import NewsletterSignup from './NewsletterSignup';

const AboutPage = () => {
  return (
    <Box sx={{ pt: { xs: 10, md: 14 }, pb: 8 }}>
      <Container maxWidth="lg">
        <Box sx={{ maxWidth: 700, mx: 'auto', textAlign: 'center', mb: 8 }}>
          <Typography variant="overline" sx={{ color: '#8b5cf6', fontSize: '0.7rem', letterSpacing: '0.14em', display: 'block', mb: 2 }}>
            About SimbaVerse
          </Typography>
          <Typography variant="h2" sx={{ color: '#f1f5f9', fontSize: { xs: '2rem', md: '3rem' }, mb: 3 }}>
            Built for the Collectors & Fans Who Remember
          </Typography>
          <Typography sx={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.8 }}>
            SimbaVerse is an independent culture hub for adults who grew up on Toonami, Saturday morning cartoons, trading cards, and the thrill of pulling something rare.
            We write power rankings, collector guides, nostalgia deep-cuts, and drop limited collectibles — all built around the stuff that mattered to us growing up.
          </Typography>
        </Box>

        <Divider sx={{ borderColor: '#1e1e30', mb: 8 }} />

        <Grid container spacing={3} sx={{ mb: 8 }}>
          {[
            { icon: '⚡', title: 'Power Rankings', body: 'Data-driven and opinion-fueled rankings of everything from starter picks to the greatest anime arcs ever made.' },
            { icon: '🃏', title: 'Collector Culture', body: 'Guides for new and veteran collectors. Pull rates, grading, display setups, and the psychology of the hunt.' },
            { icon: '📼', title: 'Nostalgia Vault', body: 'Deep dives into the shows, games, and cards that defined us. Written for adults who lived it.' },
            { icon: '🎴', title: 'Limited Drops', body: 'Original collectibles with fixed edition sizes. When they\'re gone, they\'re vaulted. Built to display, not just own.' },
            { icon: '⚔️', title: 'Battle Debates', body: 'The arguments that never get settled. We put them to a vote and let the community decide.' },
            { icon: '🔍', title: 'Worth It Reviews', body: 'Honest takes on whether a card, collectible, or set is worth your money — from people who actually buy this stuff.' },
          ].map(item => (
            <Grid item xs={12} sm={6} md={4} key={item.title}>
              <Box sx={{ p: 3, border: '1px solid #1e1e30', borderRadius: '16px', background: '#0f0f1a', height: '100%' }}>
                <Typography sx={{ fontSize: '2rem', mb: 1.5 }}>{item.icon}</Typography>
                <Typography sx={{ color: '#f1f5f9', fontFamily: '"Space Grotesk"', fontWeight: 700, mb: 0.75, fontSize: '1rem' }}>{item.title}</Typography>
                <Typography sx={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.7 }}>{item.body}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ borderColor: '#1e1e30', mb: 8 }} />

        {/* Disclaimer */}
        <Box
          sx={{
            background: 'rgba(139,92,246,0.06)',
            border: '1px solid rgba(139,92,246,0.2)',
            borderRadius: '16px',
            p: { xs: 3, md: 4 },
            mb: 8,
          }}
        >
          <Typography sx={{ color: '#a78bfa', fontFamily: '"Space Grotesk"', fontWeight: 700, mb: 1.5, fontSize: '0.95rem' }}>
            Editorial & IP Disclaimer
          </Typography>
          <Typography sx={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.8 }}>
            SimbaVerse is an independent culture and collectibles site. We are not affiliated with, sponsored by, or endorsed by any anime, gaming, or entertainment rights holders mentioned in our editorial content — including but not limited to Nintendo, The Pokémon Company, Toei Animation, Shueisha, Konami, or Bandai Namco. Our editorial articles discuss these franchises as cultural commentary and fan-oriented analysis. All SimbaVerse original products feature original designs and artwork. None of our store products are official merchandise of any third-party IP.
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Typography sx={{ color: '#f1f5f9', fontFamily: '"Space Grotesk"', fontWeight: 700, fontSize: '1.4rem', mb: 2 }}>
            Start Exploring
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button component={Link} to="/articles" variant="contained">Browse Articles</Button>
            <Button component={Link} to="/drops" variant="outlined" sx={{ borderColor: '#1e1e30', color: '#94a3b8' }}>View Drops</Button>
          </Box>
        </Box>

        <Box sx={{ mt: 8 }}>
          <NewsletterSignup variant="banner" />
        </Box>
      </Container>
    </Box>
  );
};

export default AboutPage;
