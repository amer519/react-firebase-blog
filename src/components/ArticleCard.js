import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Chip } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const CATEGORY_COLORS = {
  'power-rankings':  { bg: 'rgba(139, 92, 246, 0.12)', color: '#a78bfa', label: 'Power Rankings' },
  'collector-guides':{ bg: 'rgba(245, 158, 11, 0.12)', color: '#fbbf24', label: 'Collector Guide' },
  'nostalgia-vault': { bg: 'rgba(6, 182, 212, 0.12)',  color: '#22d3ee', label: 'Nostalgia Vault' },
  'card-of-the-week':{ bg: 'rgba(16, 185, 129, 0.12)', color: '#34d399', label: 'Card of the Week' },
  'battle-debate':   { bg: 'rgba(239, 68, 68, 0.12)',  color: '#f87171', label: 'Battle Debate' },
  'beginner-guides': { bg: 'rgba(99, 102, 241, 0.12)', color: '#818cf8', label: 'Beginner Guide' },
  'drop-story':      { bg: 'rgba(245, 158, 11, 0.12)', color: '#fbbf24', label: 'Drop Story' },
  'display-setup':   { bg: 'rgba(139, 92, 246, 0.12)', color: '#a78bfa', label: 'Display Setup' },
  'worth-it':        { bg: 'rgba(6, 182, 212, 0.12)',  color: '#22d3ee', label: 'Worth It?' },
};

const CATEGORY_ICONS = {
  'power-rankings':  '⚡',
  'collector-guides':'🃏',
  'nostalgia-vault': '📼',
  'card-of-the-week':'🎴',
  'battle-debate':   '⚔️',
  'beginner-guides': '📖',
  'drop-story':      '🎁',
  'display-setup':   '🖼',
  'worth-it':        '🤔',
};

const CATEGORY_GRADIENTS = {
  'power-rankings':  '#1a0533 0%, #2d1060 100%',
  'collector-guides':'#1a1000 0%, #3d2800 100%',
  'nostalgia-vault': '#001a1a 0%, #003333 100%',
  'card-of-the-week':'#001a0d 0%, #003320 100%',
  'battle-debate':   '#1a0000 0%, #330000 100%',
  'beginner-guides': '#0a0020 0%, #1a0040 100%',
  'drop-story':      '#1a0800 0%, #331500 100%',
  'display-setup':   '#0d001a 0%, #1a0033 100%',
  'worth-it':        '#001a1a 0%, #003333 100%',
};

const getCategoryIcon     = (cat) => CATEGORY_ICONS[cat]     || '✦';
const getCategoryGradient = (cat) => CATEGORY_GRADIENTS[cat] || '#0f0f1a 0%, #1e1e30 100%';

const estimateReadTime = (content = '') =>
  Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200));

// Renders an img that falls back to a styled placeholder if the URL fails to load.
const CardImage = ({ src, alt, sx = {}, fallbackIcon = '✦', gradient }) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          background: `linear-gradient(135deg, ${gradient})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...sx,
        }}
      >
        <Typography sx={{ fontSize: '3rem', opacity: 0.18, userSelect: 'none' }}>
          {fallbackIcon}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      component="img"
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', ...sx }}
    />
  );
};

const ArticleCard = ({ article, variant = 'default' }) => {
  const catKey   = article.category || '';
  const catStyle = CATEGORY_COLORS[catKey] || { bg: 'rgba(100,116,139,0.1)', color: '#94a3b8', label: catKey || 'Article' };
  const icon     = getCategoryIcon(catKey);
  const gradient = getCategoryGradient(catKey);
  const readTime = article.readTime || estimateReadTime(article.content);
  const date     = article.createdAt?.toDate?.() || (article.createdAt instanceof Date ? article.createdAt : new Date());

  /* ── Hero ──────────────────────────────────────────── */
  if (variant === 'hero') {
    return (
      <Link to={`/articles/${article.id}`} style={{ display: 'block', textDecoration: 'none' }}>
        <Box
          sx={{
            position: 'relative',
            borderRadius: '20px',
            overflow: 'hidden',
            border: '1px solid #1e1e30',
            background: '#0f0f1a',
            cursor: 'pointer',
            '&:hover': { borderColor: '#2d2d45' },
            transition: 'border-color 0.25s',
            height: { xs: 300, md: 440 },
          }}
        >
          {/* Full-bleed image with error fallback */}
          <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
            <CardImage
              src={article.imageUrl}
              alt={article.imageAlt || article.title}
              fallbackIcon={icon}
              gradient={gradient}
              sx={{ transition: 'transform 0.5s ease' }}
            />
          </Box>

          {/* Gradient overlay */}
          <Box sx={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'linear-gradient(to top, rgba(8,8,15,0.97) 0%, rgba(8,8,15,0.35) 55%, transparent 100%)',
          }} />

          {/* Content */}
          <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, p: { xs: 2.5, md: 3.5 } }}>
            {article.featured && (
              <Box component="span" className="simba-pick" sx={{ display: 'inline-block', mb: 1.5 }}>
                ⚡ Simba's Pick
              </Box>
            )}
            <Box sx={{ display: 'flex', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
              <Chip
                label={catStyle.label}
                size="small"
                sx={{ background: catStyle.bg, color: catStyle.color, fontWeight: 700, fontSize: '0.68rem', letterSpacing: '0.06em', border: 'none', height: 22 }}
              />
            </Box>
            <Typography variant="h3" sx={{ color: '#f1f5f9', fontSize: { xs: '1.4rem', md: '1.9rem' }, lineHeight: 1.2, mb: 1 }}>
              {article.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.8rem' }}>{article.author}</Typography>
              <Box sx={{ width: 3, height: 3, borderRadius: '50%', background: '#2d2d45' }} />
              <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.8rem' }}>
                {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </Typography>
              <Box sx={{ width: 3, height: 3, borderRadius: '50%', background: '#2d2d45' }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#64748b' }}>
                <AccessTimeIcon sx={{ fontSize: '0.75rem' }} />
                <Typography sx={{ fontSize: '0.8rem' }}>{readTime}m</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Link>
    );
  }

  /* ── Compact ───────────────────────────────────────── */
  if (variant === 'compact') {
    return (
      <Link to={`/articles/${article.id}`} style={{ display: 'block', textDecoration: 'none' }}>
        <Box sx={{
          display: 'flex', gap: 1.5, p: 1.5,
          borderRadius: '12px', border: '1px solid #1e1e30',
          background: '#0f0f1a', cursor: 'pointer',
          '&:hover': { borderColor: '#2d2d45', background: '#14141f' },
          transition: 'all 0.2s',
        }}>
          {/* Thumbnail — always show (falls back to gradient) */}
          <Box sx={{ width: 64, height: 64, borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
            <CardImage
              src={article.imageUrl}
              alt={article.title}
              fallbackIcon={icon}
              gradient={gradient}
            />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Chip
              label={catStyle.label}
              size="small"
              sx={{ background: catStyle.bg, color: catStyle.color, fontWeight: 700, fontSize: '0.62rem', border: 'none', height: 18, mb: 0.5 }}
            />
            <Typography sx={{
              color: '#e2e8f0', fontFamily: '"Space Grotesk"', fontWeight: 600,
              fontSize: '0.875rem', lineHeight: 1.3,
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              {article.title}
            </Typography>
            <Typography sx={{ color: '#475569', fontSize: '0.75rem', mt: 0.25 }}>
              {readTime}m read · {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </Typography>
          </Box>
        </Box>
      </Link>
    );
  }

  /* ── Default card ──────────────────────────────────── */
  return (
    <Link to={`/articles/${article.id}`} style={{ display: 'block', textDecoration: 'none', height: '100%' }}>
      <Box sx={{
        border: '1px solid #1e1e30', borderRadius: '16px', background: '#0f0f1a',
        overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column',
        cursor: 'pointer',
        '&:hover': { borderColor: '#2d2d45', transform: 'translateY(-2px)', boxShadow: '0 8px 40px rgba(0,0,0,0.35)' },
        transition: 'all 0.25s ease',
      }}>
        {/* Image / fallback thumbnail */}
        <Box sx={{ height: 180, overflow: 'hidden', flexShrink: 0 }}>
          <CardImage
            src={article.imageUrl}
            alt={article.imageAlt || article.title}
            fallbackIcon={icon}
            gradient={gradient}
          />
        </Box>

        <Box sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.25 }}>
            <Chip
              label={catStyle.label}
              size="small"
              sx={{ background: catStyle.bg, color: catStyle.color, fontWeight: 700, fontSize: '0.65rem', letterSpacing: '0.05em', border: 'none', height: 22 }}
            />
            {article.featured && <Box component="span" className="simba-pick">⚡ Pick</Box>}
          </Box>
          <Typography sx={{
            color: '#f1f5f9', fontFamily: '"Space Grotesk"', fontWeight: 600,
            fontSize: '1rem', lineHeight: 1.35, mb: 1, flex: 1,
            display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {article.title}
          </Typography>
          {article.postSummary && (
            <Typography sx={{
              color: '#64748b', fontSize: '0.825rem', lineHeight: 1.6, mb: 1.5,
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              {article.postSummary}
            </Typography>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#475569', mt: 'auto' }}>
            <Typography sx={{ fontSize: '0.775rem' }}>{article.author}</Typography>
            <Box sx={{ width: 3, height: 3, borderRadius: '50%', background: '#2d2d45' }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
              <AccessTimeIcon sx={{ fontSize: '0.7rem' }} />
              <Typography sx={{ fontSize: '0.775rem' }}>{readTime}m</Typography>
            </Box>
            <Box sx={{ flex: 1 }} />
            <Typography sx={{ fontSize: '0.775rem' }}>
              {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Link>
  );
};

export default ArticleCard;
