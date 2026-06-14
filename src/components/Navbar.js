import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Box, Button, IconButton, Drawer, List,
  ListItem, ListItemText, Container, useScrollTrigger, Slide,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../contexts/AuthContext';
import Logout from './Logout';

const NAV_LINKS = [
  { label: 'Articles', to: '/articles' },
  { label: 'Power Rankings', to: '/category/power-rankings' },
  { label: 'Nostalgia Vault', to: '/category/nostalgia-vault' },
  { label: 'Collector Guides', to: '/category/collector-guides' },
  { label: 'Drops', to: '/drops' },
];

function HideOnScroll({ children }) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Navbar = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  return (
    <HideOnScroll>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: scrolled
            ? 'rgba(8, 8, 15, 0.92)'
            : 'rgba(8, 8, 15, 0.7)',
          backdropFilter: 'blur(20px)',
          borderBottom: scrolled ? '1px solid #1e1e30' : '1px solid transparent',
          transition: 'all 0.3s ease',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ height: 68, justifyContent: 'space-between' }}>
            {/* Logo */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #8b5cf6, #f59e0b)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  boxShadow: '0 4px 14px rgba(139,92,246,0.4)',
                  flexShrink: 0,
                }}
              >
                ⚡
              </Box>
              <Box
                sx={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontWeight: 700,
                  fontSize: '1.2rem',
                  letterSpacing: '-0.02em',
                  color: '#f1f5f9',
                }}
              >
                Simba<Box component="span" sx={{ color: '#8b5cf6' }}>Verse</Box>
              </Box>
            </Link>

            {/* Desktop Nav */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5 }}>
              {NAV_LINKS.map((link) => (
                <Button
                  key={link.to}
                  component={Link}
                  to={link.to}
                  sx={{
                    color: location.pathname.startsWith(link.to) ? '#8b5cf6' : '#94a3b8',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    px: 1.5,
                    py: 0.75,
                    borderRadius: '8px',
                    '&:hover': { color: '#f1f5f9', background: 'rgba(255,255,255,0.04)' },
                  }}
                >
                  {link.label}
                </Button>
              ))}
            </Box>

            {/* Right side */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
              {currentUser ? (
                <>
                  <Button
                    component={Link}
                    to="/admin"
                    variant="outlined"
                    size="small"
                    sx={{ borderColor: '#2d2d45', color: '#94a3b8', '&:hover': { borderColor: '#8b5cf6', color: '#8b5cf6' } }}
                  >
                    Admin
                  </Button>
                  <Button
                    component={Link}
                    to="/admin/create"
                    variant="outlined"
                    size="small"
                    sx={{ borderColor: '#2d2d45', color: '#94a3b8', '&:hover': { borderColor: '#8b5cf6', color: '#8b5cf6' } }}
                  >
                    + Post
                  </Button>
                  <Button
                    component={Link}
                    to="/admin/drops/new"
                    variant="outlined"
                    size="small"
                    sx={{ borderColor: '#2d2d45', color: '#94a3b8', '&:hover': { borderColor: '#f59e0b', color: '#f59e0b' } }}
                  >
                    + Drop
                  </Button>
                  <Logout />
                </>
              ) : (
                <Button
                  component={Link}
                  to="/drops"
                  variant="contained"
                  size="small"
                  sx={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', boxShadow: '0 4px 14px rgba(139,92,246,0.35)' }}
                >
                  View Drops
                </Button>
              )}
            </Box>

            {/* Mobile hamburger */}
            <IconButton
              sx={{ display: { xs: 'flex', md: 'none' }, color: '#94a3b8' }}
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  );
};

export const MobileDrawer = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <>
      <IconButton
        sx={{ display: { xs: 'flex', md: 'none' }, color: '#94a3b8', position: 'fixed', top: 14, right: 16, zIndex: 1400 }}
        onClick={() => setOpen(true)}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            background: '#0f0f1a',
            borderLeft: '1px solid #1e1e30',
            p: 3,
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ fontFamily: '"Space Grotesk"', fontWeight: 700, color: '#f1f5f9' }}>
            Simba<Box component="span" sx={{ color: '#8b5cf6' }}>Verse</Box>
          </Box>
          <IconButton onClick={() => setOpen(false)} sx={{ color: '#64748b' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List disablePadding>
          {NAV_LINKS.map((link) => (
            <ListItem key={link.to} disablePadding sx={{ mb: 0.5 }}>
              <Button
                component={Link}
                to={link.to}
                fullWidth
                sx={{
                  justifyContent: 'flex-start',
                  color: location.pathname.startsWith(link.to) ? '#8b5cf6' : '#94a3b8',
                  fontWeight: 500,
                  py: 1.25,
                  px: 1.5,
                  borderRadius: '10px',
                  '&:hover': { background: 'rgba(255,255,255,0.04)', color: '#f1f5f9' },
                }}
              >
                {link.label}
              </Button>
            </ListItem>
          ))}
          {currentUser && (
            <>
              <ListItem disablePadding sx={{ mt: 2, mb: 0.5 }}>
                <Button component={Link} to="/admin/create" fullWidth variant="outlined" sx={{ borderColor: '#2d2d45', color: '#94a3b8' }}>
                  + New Post
                </Button>
              </ListItem>
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <Button component={Link} to="/admin/drops/new" fullWidth variant="outlined" sx={{ borderColor: '#2d2d45', color: '#94a3b8' }}>
                  + New Drop
                </Button>
              </ListItem>
              <ListItem disablePadding>
                <Logout fullWidth />
              </ListItem>
            </>
          )}
        </List>
      </Drawer>
    </>
  );
};

export default Navbar;
