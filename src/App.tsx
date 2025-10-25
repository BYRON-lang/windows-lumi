import React, { useState, useEffect } from 'react';
import { MemoryRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import TopBar from './components/TopBar';
import Home from './pages/Home';
import LumiAIPage from './pages/LumiAIPage';
import ChatHistoryPage from './pages/ChatHistoryPage';
import GoalsPage from './pages/GoalsPage';
import RemindersPage from './pages/RemindersPage';
import NotesPage from './pages/NotesPage';
import EditorPage from './pages/EditorPage';
import { useAuthService } from './services/authService';
import logoImage from './logo/logo.png';

function Homepage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const authService = useAuthService();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
        // If user is authenticated, go to home
        navigate('/home');
      } catch (error) {
        console.log('Not authenticated');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for auth callbacks
    if (window.electronAPI?.onAuthCallback) {
      window.electronAPI.onAuthCallback(async (token: string) => {
        try {
          // Reload user data after successful auth
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
          navigate('/home');
        } catch (error) {
          console.error('Error loading user after auth:', error);
        }
      });
    }

    return () => {
      if (window.electronAPI?.removeAuthCallbackListener) {
        window.electronAPI.removeAuthCallbackListener();
      }
    };
  }, [navigate]);

  const handleGoogleAuth = async () => {
    try {
      // Google OAuth - handles both login and signup automatically
      if (window.electronAPI?.authLogin) {
        await window.electronAPI.authLogin();
      }
    } catch (error) {
      console.error('Google auth error:', error);
    }
  };

  const handleEmailSignup = async () => {
    try {
      // Email signup for new users
      if (window.electronAPI?.authSignup) {
        await window.electronAPI.authSignup();
      }
    } catch (error) {
      console.error('Email signup error:', error);
    }
  };

  const handleEmailLogin = async () => {
    try {
      // Email login for existing users
      if (window.electronAPI && (window.electronAPI as any).authEmailLogin) {
        await (window.electronAPI as any).authEmailLogin();
      }
    } catch (error) {
      console.error('Email login error:', error);
    }
  };

  if (isLoading) {
    return (
      <div style={{
        width: '100%',
        height: '100vh',
        backgroundColor: '#161616',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          color: 'white',
          fontSize: '18px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            border: '2px solid #333',
            borderTop: '2px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          Loading Lumi...
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      backgroundColor: '#161616',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Top Bar */}
      <TopBar background="#161616" showLogo={false} showSidebarToggle={false} />

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0'
      }}>
        {/* Logo */}
        <div style={{ marginBottom: '8px' }}>
          <img
            src={logoImage}
            alt="Lumi Logo"
            style={{
              filter: 'brightness(0) invert(1)',
              height: 'auto',
              width: '100px',
              userSelect: 'none'
            }}
            draggable="false"
          />
        </div>

        {/* Welcome Text */}
        <div style={{ marginTop: '4px' }}>
          <h1
            style={{
              color: 'white',
              fontWeight: '500',
              fontSize: '50px',
              margin: 0
            }}
          >
            Welcome to Lumi
          </h1>
        </div>

        {/* Subtitle */}
        <div style={{ marginTop: '4px' }}>
          <p
            style={{
              color: '#808080',
              fontWeight: '400',
              fontSize: '20px',
              margin: 0
            }}
          >
            Your AI Personal Assistant
          </p>
        </div>

        {/* Google Button */}
        <div style={{ marginTop: '24px', width: '380px', display: 'flex', justifyContent: 'center' }}>
          <button
            style={{
              backgroundColor: '#262626',
              border: '1px solid #262626',
              borderRadius: '12px',
              height: '50px',
              width: '100%',
              boxSizing: 'border-box',
              padding: '0 24px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: '500',
              transition: 'background-color 150ms ease, border-color 150ms ease'
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#333333'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#333333'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#262626'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#262626'; }}
            onClick={handleGoogleAuth}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 128 128"><path fill="#fff" d="M44.59 4.21a63.28 63.28 0 0 0 4.33 120.9a67.6 67.6 0 0 0 32.36.35a57.13 57.13 0 0 0 25.9-13.46a57.44 57.44 0 0 0 16-26.26a74.33 74.33 0 0 0 1.61-33.58H65.27v24.69h34.47a29.72 29.72 0 0 1-12.66 19.52a36.16 36.16 0 0 1-13.93 5.5a41.29 41.29 0 0 1-15.1 0A37.16 37.16 0 0 1 44 95.74a39.3 39.3 0 0 1-14.5-19.42a38.31 38.31 0 0 1 0-24.63a39.25 39.25 0 0 1 9.18-14.91A37.17 37.17 0 0 1 76.13 27a34.28 34.28 0 0 1 13.64 8q5.83-5.8 11.64-11.63c2-2.09 4.18-4.08 6.15-6.22A61.22 61.22 0 0 0 87.2 4.59a64 64 0 0 0-42.61-.38z"/><path fill="#e33629" d="M44.59 4.21a64 64 0 0 1 42.61.37a61.22 61.22 0 0 1 20.35 12.62c-2 2.14-4.11 4.14-6.15 6.22Q95.58 29.23 89.77 35a34.28 34.28 0 0 0-13.64-8a37.17 37.17 0 0 0-37.46 9.74a39.25 39.25 0 0 0-9.18 14.91L8.76 35.6A63.53 63.53 0 0 1 44.59 4.21z"/><path fill="#f8bd00" d="M3.26 51.5a62.93 62.93 0 0 1 5.5-15.9l20.73 16.09a38.31 38.31 0 0 0 0 24.63q-10.36 8-20.73 16.08a63.33 63.33 0 0 1-5.5-40.9z"/><path fill="#587dbd" d="M65.27 52.15h59.52a74.33 74.33 0 0 1-1.61 33.58a57.44 57.44 0 0 1-16 26.26c-6.69-5.22-13.41-10.4-20.1-15.62a29.72 29.72 0 0 0 12.66-19.54H65.27c-.01-8.22 0-16.45 0-24.68z"/><path fill="#319f43" d="M8.75 92.4q10.37-8 20.73-16.08A39.3 39.3 0 0 0 44 95.74a37.16 37.16 0 0 0 14.08 6.08a41.29 41.29 0 0 0 15.1 0a36.16 36.16 0 0 0 13.93-5.5c6.69 5.22 13.41 10.4 20.1 15.62a57.13 57.13 0 0 1-25.9 13.47a67.6 67.6 0 0 1-32.36-.35a63 63 0 0 1-23-11.59A63.73 63.73 0 0 1 8.75 92.4z"/></svg>
            </span>
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Email Button */}
        <div style={{ marginTop: '12px', width: '380px', display: 'flex', justifyContent: 'center' }}>
          <button
            style={{
              backgroundColor: '#262626',
              border: '1px solid #262626',
              borderRadius: '12px',
              height: '50px',
              width: '100%',
              boxSizing: 'border-box',
              padding: '0 24px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: '500',
              transition: 'background-color 150ms ease, border-color 150ms ease'
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#333333'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#333333'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#262626'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#262626'; }}
            onClick={handleEmailSignup}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#ffffff" d="M5 5h13a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3m0 1c-.5 0-.94.17-1.28.47l7.78 5.03l7.78-5.03C18.94 6.17 18.5 6 18 6H5m6.5 6.71L3.13 7.28C3.05 7.5 3 7.75 3 8v9a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2V8c0-.25-.05-.5-.13-.72l-8.37 5.43Z"/></svg>
            </span>
            <span>Sign up with email</span>
          </button>
        </div>

        {/* Login Link for Existing Users */}
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <button
            style={{
              background: 'none',
              border: 'none',
              color: '#808080',
              fontSize: '14px',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: '4px 8px'
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#ffffff'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#808080'; }}
            onClick={handleEmailLogin}
          >
            Already have an account? Sign in
          </button>
        </div>

        {/* You can add more UI elements here later */}
      </div>

      {/* Footer */}
      <div style={{ width: '100%', textAlign: 'center', color: '#808080', padding: '0' }}>
        <p style={{ margin: 0, fontSize: '12px', fontWeight: 400 }}>
          By continuing you agree to Lumi 
          <a href="#" style={{ color: '#808080', textDecoration: 'underline' }}>privacy policy</a> 
          and 
          <a href="#" style={{ color: '#808080', textDecoration: 'underline' }}>terms of service</a>
        </p>
      </div>
    </div>
  );
}

function ProtectedHome() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const authService = useAuthService();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        // Not authenticated, redirect to welcome
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/');
    }
  };

  if (isLoading) {
    return (
      <div style={{
        width: '100%',
        height: '100vh',
        backgroundColor: '#191919',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          color: 'white',
          fontSize: '18px'
        }}>
          Loading...
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to / in useEffect
  }

  return <Home onLogout={handleLogout} />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/welcome" element={<Homepage />} />
        <Route path="/home" element={<ProtectedHome />} />
        <Route path="/lumi-ai" element={<LumiAIPage />} />
        <Route path="/chat-history" element={<ChatHistoryPage />} />
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/reminders" element={<RemindersPage />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/editor" element={<EditorPage />} />
      </Routes>
    </Router>
  );
}
