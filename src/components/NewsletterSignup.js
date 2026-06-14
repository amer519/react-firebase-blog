import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert } from '@mui/material';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const NewsletterSignup = ({ variant = 'default', dropId = null }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const collectionName = dropId ? 'drop_waitlist' : 'newsletter';
      await addDoc(collection(db, collectionName), {
        email: email.toLowerCase().trim(),
        dropId: dropId || null,
        createdAt: serverTimestamp(),
      });
      setSuccess(true);
      setEmail('');
    } catch (err) {
      console.error('Signup error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (variant === 'banner') {
    return (
      <Box
        sx={{
          background: 'linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(245,158,11,0.08) 100%)',
          border: '1px solid rgba(139,92,246,0.2)',
          borderRadius: '20px',
          p: { xs: 3, md: 5 },
          textAlign: 'center',
        }}
      >
        <Typography variant="overline" sx={{ color: '#8b5cf6', letterSpacing: '0.15em', fontSize: '0.7rem', display: 'block', mb: 1 }}>
          Join the Drop List
        </Typography>
        <Typography variant="h3" sx={{ color: '#f1f5f9', fontSize: { xs: '1.5rem', md: '2rem' }, mb: 1 }}>
          Be First. Every Drop. Every Time.
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b', mb: 3, maxWidth: 480, mx: 'auto', fontSize: '0.925rem' }}>
          Get early access alerts when new limited drops go live. No spam — just rare releases and culture updates from SimbaVerse.
        </Typography>
        {success ? (
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '12px', px: 3, py: 1.5 }}>
            <Typography sx={{ color: '#34d399', fontFamily: '"Space Grotesk"', fontWeight: 600 }}>
              ✓ You're on the list. Watch your inbox.
            </Typography>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1.5, maxWidth: 420, mx: 'auto', flexDirection: { xs: 'column', sm: 'row' } }}>
            <TextField
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              size="small"
              sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: '10px', background: '#0f0f1a' } }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ whiteSpace: 'nowrap', background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', boxShadow: '0 4px 16px rgba(139,92,246,0.35)', px: 3 }}
            >
              {loading ? 'Joining…' : 'Notify Me'}
            </Button>
          </Box>
        )}
        {error && <Alert severity="error" sx={{ mt: 2, maxWidth: 420, mx: 'auto' }}>{error}</Alert>}
      </Box>
    );
  }

  if (variant === 'drop') {
    return (
      <Box sx={{ background: '#14141f', border: '1px solid #1e1e30', borderRadius: '14px', p: 2.5 }}>
        <Typography sx={{ color: '#f1f5f9', fontFamily: '"Space Grotesk"', fontWeight: 700, fontSize: '1rem', mb: 0.5 }}>
          Get Notified When This Drops
        </Typography>
        <Typography sx={{ color: '#64748b', fontSize: '0.8rem', mb: 1.5 }}>
          Limited edition — secure your spot on the waitlist.
        </Typography>
        {success ? (
          <Typography sx={{ color: '#34d399', fontFamily: '"Space Grotesk"', fontWeight: 600, fontSize: '0.875rem' }}>
            ✓ You're on the waitlist.
          </Typography>
        ) : (
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1 }}>
            <TextField
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              size="small"
              sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: '8px', fontSize: '0.825rem' } }}
            />
            <Button type="submit" variant="contained" size="small" disabled={loading} sx={{ whiteSpace: 'nowrap', px: 2 }}>
              {loading ? '…' : 'Join'}
            </Button>
          </Box>
        )}
        {error && <Typography sx={{ color: '#ef4444', fontSize: '0.75rem', mt: 0.75 }}>{error}</Typography>}
      </Box>
    );
  }

  // Default inline
  return (
    <Box>
      {success ? (
        <Typography sx={{ color: '#34d399', fontWeight: 600 }}>✓ You're on the list!</Typography>
      ) : (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1 }}>
          <TextField
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            size="small"
            sx={{ flex: 1 }}
          />
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? '…' : 'Subscribe'}
          </Button>
        </Box>
      )}
      {error && <Typography sx={{ color: '#ef4444', fontSize: '0.75rem', mt: 0.5 }}>{error}</Typography>}
    </Box>
  );
};

export default NewsletterSignup;
