import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login.tsx';
import Posts from './pages/Whispers.tsx';
import ProtectedRoute from './pages/ProtectedRoute.tsx';
import { useAuth } from './AuthContext';
import { AppBar, Box, Button, IconButton, Toolbar } from '@mui/material';
import WhispersProvider from './pages/WhispersProvider.tsx';
import Post from './pages/Whisper.tsx';
import Secondary_Logo from './assets/Secondary_Black.svg';
import CommunityGuidelines from './pages/CommunityGuidelines.tsx';


const NavbarComponent = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const backendURL = 'http://127.0.0.1:5000/api';

  const handleLogout = async () => {
    try {
      const response = await fetch(`${backendURL}/logout`, {
        method: 'POST',
        credentials: 'include', // Important for sending cookies
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      // Only call frontend logout if backend logout was successful
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      // You might want to show an error message to the user here
    }
  };

  if (!user) return null;

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="logo"
          onClick={() => navigate('/')}
        >
          <img
            src={Secondary_Logo}
            alt="Logo"
            style={{
              height: '24px',
              width: 'auto'
            }}
          />
        </IconButton>
        <Box sx={{ display: { xs: 'block', sm: 'flex' }, justifyContent: 'end', width: '100%' }}>
          <Button color="primary" onClick={() => navigate('/community-guidelines')}>
            Community Guidelines
          </Button>
          <Button color="primary" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

// Main component that sets up the router
const MoneyWhispersNavbar = () => {
  return (
    <Router>
      <NavbarComponent />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <WhispersProvider>
                <Posts />
              </WhispersProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path="/community-guidelines"
          element={<CommunityGuidelines />}
        />

        <Route
          path="/whisper/:whisperId"
          element={
            <ProtectedRoute>
              <Post />
            </ProtectedRoute>
          }
        />
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default MoneyWhispersNavbar;