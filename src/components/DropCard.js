import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Chip, LinearProgress } from '@mui/material';
import CountdownTimer from './CountdownTimer';

// Shows drop image or a styled fallback if the URL errors (handles 402/403 from Firebase billing issues).
const DropImage = ({ src, alt }) => {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #14141f 0%, #1a0533 100%)' }}>
        <Typography sx={{ fontSize: '3rem', opacity: 0.2, userSelect: 'none' }}>🎴</Typography>
      </Box>
    );
  }
  return (
    <Box
      component="img"
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s ease' }}
    />
  );
};

const STATUS_CONFIG = {
  upcoming: { label: 'Dropping Soon', bg: 'rgba(245, 158, 11, 0.12)', color: '#fbbf24', dot: '#f59e0b' },
  live: { label: 'Live Now', bg: 'rgba(16, 185, 129, 0.12)', color: '#34d399', dot: '#10b981' },
  'sold-out': { label: 'Sold Out', bg: 'rgba(100, 116, 139, 0.12)', color: '#64748b', dot: '#475569' },
  archived: { label: 'Vaulted', bg: 'rgba(100, 116, 139, 0.08)', color: '#334155', dot: '#334155' },
};

const DropCard = ({ drop, variant = 'default' }) => {
  const statusCfg = STATUS_CONFIG[drop.status] || STATUS_CONFIG.upcoming;
  const stockPct = drop.editionSize > 0 ? ((drop.stockRemaining ?? drop.editionSize) / drop.editionSize) * 100 : 100;
  const dropDate = drop.dropDate?.toDate?.() || (drop.dropDate ? new Date(drop.dropDate) : null);
  const mainImage = (drop.imageUrls && drop.imageUrls[0]) || drop.imageUrl || '';

  return (
    <Link to={`/drops/${drop.id}`} style={{ display: 'block', textDecoration: 'none', height: '100%' }}>
      <Box
        sx={{
          border: '1px solid #1e1e30', borderRadius: '18px', background: '#0f0f1a',
          overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column',
          cursor: 'pointer',
          '&:hover': { borderColor: '#8b5cf6', transform: 'translateY(-3px)', boxShadow: '0 12px 48px rgba(139,92,246,0.15)' },
          transition: 'all 0.3s ease',
          opacity: drop.status === 'archived' ? 0.6 : 1,
        }}
      >
        {/* Image */}
        <Box sx={{ height: 200, overflow: 'hidden', position: 'relative', background: '#14141f' }}>
          <DropImage src={mainImage} alt={drop.name} />
          {/* Status badge */}
          <Box sx={{ position: 'absolute', top: 12, left: 12 }}>
            <Box
              sx={{
                display: 'inline-flex', alignItems: 'center', gap: 0.75,
                background: statusCfg.bg, backdropFilter: 'blur(8px)',
                border: `1px solid ${statusCfg.dot}30`,
                borderRadius: '8px', px: 1.25, py: 0.5,
              }}
            >
              {drop.status === 'live' && (
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: statusCfg.dot, boxShadow: `0 0 6px ${statusCfg.dot}`, animation: 'pulse 1.5s ease-in-out infinite' }} />
              )}
              <Typography sx={{ color: statusCfg.color, fontSize: '0.7rem', fontFamily: '"Space Grotesk"', fontWeight: 700, letterSpacing: '0.06em' }}>
                {statusCfg.label}
              </Typography>
            </Box>
          </Box>
          {/* Edition size */}
          {drop.editionSize > 0 && (
            <Box sx={{ position: 'absolute', top: 12, right: 12, background: 'rgba(8,8,15,0.75)', backdropFilter: 'blur(6px)', borderRadius: '7px', px: 1, py: 0.5 }}>
              <Typography sx={{ color: '#64748b', fontSize: '0.68rem', fontFamily: '"Space Grotesk"', fontWeight: 600 }}>
                Ed. {drop.editionSize}
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography sx={{ color: '#f1f5f9', fontFamily: '"Space Grotesk"', fontWeight: 700, fontSize: '1.05rem', lineHeight: 1.3, mb: 0.75 }}>
            {drop.name}
          </Typography>
          {drop.description && (
            <Typography sx={{ color: '#64748b', fontSize: '0.825rem', lineHeight: 1.6, mb: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {drop.description}
            </Typography>
          )}

          <Box sx={{ mt: 'auto' }}>
            {drop.status === 'upcoming' && dropDate && (
              <Box sx={{ mb: 1.5 }}>
                <CountdownTimer targetDate={dropDate} size="sm" />
              </Box>
            )}

            {drop.editionSize > 0 && drop.status === 'live' && (
              <Box sx={{ mb: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography sx={{ color: '#64748b', fontSize: '0.72rem' }}>Remaining</Typography>
                  <Typography sx={{ color: '#f59e0b', fontSize: '0.72rem', fontWeight: 600 }}>{drop.stockRemaining ?? drop.editionSize} / {drop.editionSize}</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={stockPct}
                  sx={{
                    height: 4, borderRadius: 2, background: '#1e1e30',
                    '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #8b5cf6, #f59e0b)', borderRadius: 2 },
                  }}
                />
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ color: '#f1f5f9', fontFamily: '"Space Grotesk"', fontWeight: 700, fontSize: '1.15rem' }}>
                {drop.price ? `$${drop.price.toFixed(2)}` : 'TBA'}
              </Typography>
              <Box
                sx={{
                  background: drop.status === 'live' ? 'linear-gradient(135deg, #8b5cf6, #6d28d9)' : 'transparent',
                  border: drop.status !== 'live' ? '1px solid #1e1e30' : 'none',
                  color: drop.status === 'live' ? '#fff' : '#64748b',
                  borderRadius: '8px', px: 1.5, py: 0.6,
                  fontSize: '0.78rem', fontFamily: '"Space Grotesk"', fontWeight: 600,
                }}
              >
                {drop.status === 'live' ? 'Get It' : drop.status === 'upcoming' ? 'Notify Me' : drop.status === 'sold-out' ? 'Sold Out' : 'View'}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Link>
  );
};

export default DropCard;
