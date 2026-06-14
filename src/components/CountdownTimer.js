import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

const pad = (n) => String(n).padStart(2, '0');

const CountdownTimer = ({ targetDate, size = 'md', label = 'Drop opens in' }) => {
  const [timeLeft, setTimeLeft] = useState({});
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const tick = () => {
      const diff = new Date(targetDate) - new Date();
      if (diff <= 0) {
        setExpired(true);
        return;
      }
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ days, hours, minutes, seconds });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  if (expired) {
    return (
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1,
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '10px',
          px: 2,
          py: 1,
        }}
      >
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#10b981',
            boxShadow: '0 0 8px #10b981',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
        <Typography sx={{ color: '#10b981', fontFamily: '"Space Grotesk"', fontWeight: 600, fontSize: size === 'sm' ? '0.8rem' : '0.9rem' }}>
          Drop is Live
        </Typography>
      </Box>
    );
  }

  const segments = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hrs', value: timeLeft.hours },
    { label: 'Min', value: timeLeft.minutes },
    { label: 'Sec', value: timeLeft.seconds },
  ];

  const blockSize = size === 'sm' ? 48 : size === 'lg' ? 72 : 58;
  const numSize = size === 'sm' ? '1.1rem' : size === 'lg' ? '1.8rem' : '1.4rem';
  const lblSize = size === 'sm' ? '0.55rem' : '0.65rem';

  return (
    <Box>
      {label && (
        <Typography
          variant="overline"
          sx={{ color: '#64748b', display: 'block', mb: 1, fontSize: '0.68rem', letterSpacing: '0.1em' }}
        >
          {label}
        </Typography>
      )}
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        {segments.map((seg, i) => (
          <React.Fragment key={seg.label}>
            <Box
              sx={{
                width: blockSize,
                height: blockSize,
                background: '#14141f',
                border: '1px solid #1e1e30',
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                sx={{
                  fontFamily: '"Space Grotesk"',
                  fontWeight: 700,
                  fontSize: numSize,
                  color: '#f1f5f9',
                  lineHeight: 1,
                }}
              >
                {seg.value !== undefined ? pad(seg.value) : '--'}
              </Typography>
              <Typography sx={{ fontSize: lblSize, color: '#475569', fontWeight: 600, letterSpacing: '0.06em', mt: 0.25 }}>
                {seg.label}
              </Typography>
            </Box>
            {i < 3 && (
              <Typography sx={{ color: '#8b5cf6', fontWeight: 700, fontSize: numSize, lineHeight: 1 }}>:</Typography>
            )}
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
};

export default CountdownTimer;
