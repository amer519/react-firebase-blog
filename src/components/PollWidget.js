import React, { useState, useEffect } from 'react';
import { Box, Typography, LinearProgress, Button } from '@mui/material';
import { doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const FALLBACK_POLLS = [
  {
    id: 'starter-poll-1',
    question: 'Which type do you always pick first?',
    options: [
      { id: 'fire', label: '🔥 Fire' },
      { id: 'water', label: '💧 Water' },
      { id: 'grass', label: '🌿 Grass' },
      { id: 'electric', label: '⚡ Electric' },
    ],
    votes: { fire: 482, water: 310, grass: 198, electric: 276 },
  },
  {
    id: 'era-poll-1',
    question: 'Best era of Saturday morning cartoons?',
    options: [
      { id: '90s', label: '🟡 90s Toonami' },
      { id: '00s', label: '🔵 2000s Block' },
      { id: '80s', label: '🔴 80s Originals' },
      { id: '10s', label: '🟣 2010s Netflix' },
    ],
    votes: { '90s': 621, '00s': 445, '80s': 189, '10s': 102 },
  },
];

const PollWidget = ({ pollData = null }) => {
  const poll = pollData || FALLBACK_POLLS[Math.floor(Math.random() * FALLBACK_POLLS.length)];
  const storageKey = `simba_poll_${poll.id}`;

  const [votes, setVotes] = useState(poll.votes || {});
  const [selected, setSelected] = useState(() => localStorage.getItem(storageKey));
  const [loading, setLoading] = useState(false);

  const totalVotes = Object.values(votes).reduce((sum, v) => sum + v, 0);

  const handleVote = async (optionId) => {
    if (selected || loading) return;
    setLoading(true);
    const newVotes = { ...votes, [optionId]: (votes[optionId] || 0) + 1 };
    setVotes(newVotes);
    setSelected(optionId);
    localStorage.setItem(storageKey, optionId);

    if (pollData) {
      try {
        const pollRef = doc(db, 'polls', poll.id);
        await updateDoc(pollRef, { [`votes.${optionId}`]: increment(1) });
      } catch (err) {
        console.error('Vote error:', err);
      }
    }
    setLoading(false);
  };

  return (
    <Box
      sx={{
        background: '#0f0f1a',
        border: '1px solid #1e1e30',
        borderRadius: '16px',
        p: { xs: 2.5, md: 3 },
      }}
    >
      <Typography variant="overline" sx={{ color: '#8b5cf6', fontSize: '0.68rem', letterSpacing: '0.12em', display: 'block', mb: 1 }}>
        Battle Debate
      </Typography>
      <Typography sx={{ color: '#f1f5f9', fontFamily: '"Space Grotesk"', fontWeight: 700, fontSize: '1.05rem', lineHeight: 1.35, mb: 2 }}>
        {poll.question}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {poll.options.map((opt) => {
          const voteCount = votes[opt.id] || 0;
          const pct = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
          const isWinner = selected && voteCount === Math.max(...Object.values(votes));
          const isSelected = selected === opt.id;

          return (
            <Box
              key={opt.id}
              onClick={() => handleVote(opt.id)}
              sx={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '10px',
                border: isSelected ? '1px solid #8b5cf6' : '1px solid #1e1e30',
                background: isSelected ? 'rgba(139,92,246,0.08)' : '#14141f',
                cursor: selected ? 'default' : 'pointer',
                p: 1.5,
                transition: 'all 0.2s',
                '&:hover': selected ? {} : { borderColor: '#2d2d45', background: '#1a1a28' },
              }}
            >
              {/* Progress bar fill */}
              {selected && (
                <Box
                  sx={{
                    position: 'absolute', inset: 0, right: 'auto',
                    width: `${pct}%`,
                    background: isSelected ? 'rgba(139,92,246,0.12)' : 'rgba(255,255,255,0.03)',
                    transition: 'width 0.6s ease',
                  }}
                />
              )}
              <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ color: isSelected ? '#a78bfa' : '#e2e8f0', fontWeight: 600, fontSize: '0.875rem', fontFamily: '"Space Grotesk"' }}>
                  {opt.label}
                  {isWinner && selected && <Box component="span" sx={{ ml: 1, color: '#f59e0b', fontSize: '0.75rem' }}>👑</Box>}
                </Typography>
                {selected && (
                  <Typography sx={{ color: isSelected ? '#8b5cf6' : '#64748b', fontFamily: '"Space Grotesk"', fontWeight: 700, fontSize: '0.875rem' }}>
                    {pct}%
                  </Typography>
                )}
              </Box>
            </Box>
          );
        })}
      </Box>

      <Typography sx={{ color: '#334155', fontSize: '0.72rem', mt: 1.5, textAlign: 'right' }}>
        {totalVotes.toLocaleString()} votes
      </Typography>
    </Box>
  );
};

export default PollWidget;
