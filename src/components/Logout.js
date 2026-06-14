import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Logout = ({ fullWidth = false }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <Button
      onClick={handleLogout}
      fullWidth={fullWidth}
      sx={{
        color: '#64748b',
        fontWeight: 500,
        fontSize: '0.875rem',
        '&:hover': { color: '#ef4444', background: 'rgba(239,68,68,0.06)' },
      }}
    >
      Sign Out
    </Button>
  );
};

export default Logout;
