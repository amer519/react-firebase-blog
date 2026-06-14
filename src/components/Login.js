import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Box, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at top, rgba(139,92,246,0.08) 0%, transparent 60%)',
        px: 2,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 380 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Link to="/">
            <Box sx={{ fontFamily: '"Space Grotesk"', fontWeight: 700, fontSize: '1.4rem', color: '#f1f5f9', mb: 1 }}>
              Simba<Box component="span" sx={{ color: '#8b5cf6' }}>Verse</Box>
            </Box>
          </Link>
          <Typography sx={{ color: '#475569', fontSize: '0.875rem' }}>Admin access only</Typography>
        </Box>

        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{ background: '#0f0f1a', border: '1px solid #1e1e30', borderRadius: '20px', p: 3.5 }}
        >
          <Typography variant="h6" sx={{ color: '#f1f5f9', fontFamily: '"Space Grotesk"', mb: 3 }}>
            Sign In
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2.5 }}>{error}</Alert>}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              type="email"
              label="Email"
              fullWidth
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
            />
            <TextField
              type="password"
              label="Password"
              fullWidth
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ mt: 0.5, py: 1.25 }}
            >
              {loading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Sign In'}
            </Button>
          </Box>
        </Box>

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Link to="/">
            <Typography sx={{ color: '#475569', fontSize: '0.8rem', '&:hover': { color: '#8b5cf6' } }}>
              ← Back to site
            </Typography>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
