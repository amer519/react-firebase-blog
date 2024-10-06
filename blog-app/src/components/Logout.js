// src/components/Logout.js
import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login'); // Redirect to login page after logout
    } catch (err) {
      console.error('Logout Error:', err);
      // Optionally, set an error state to display a message to the user
    }
  };

  return (
    <Button
      variant="outlined"
      color="secondary"
      onClick={handleLogout}
      aria-label="Logout"
    >
      Log Out
    </Button>
  );
};

export default Logout;
