import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import tokenManager from './utils/tokenManager';

function App() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('login'); // 'login' or 'register'

  useEffect(() => {
    // Check if user is already logged in
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      // First, check if there's a JWT token
      if (tokenManager.hasToken()) {
        const response = await fetch('/api/auth/verify', {
          headers: {
            ...tokenManager.getAuthHeader()
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setAccount({ ...data.user, isJWT: true });
            setLoading(false);
            return;
          }
        } else {
          // Token is invalid, remove it
          tokenManager.removeToken();
        }
      }

      // Check for session-based auth (demo account)
      const response = await fetch('/api/account', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAccount(data.account);
        }
      }
    } catch (error) {
      console.error('Session check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (accountData) => {
    setAccount(accountData);
  };

  const handleRegister = (userData) => {
    setAccount(userData);
  };

  const handleLogout = async () => {
    try {
      // Check if it's a JWT account or demo account
      if (account?.isJWT) {
        // For JWT, just remove the token
        tokenManager.removeToken();
        setAccount(null);
      } else {
        // For demo account, call the logout endpoint
        const response = await fetch('/api/logout', {
          method: 'POST',
          credentials: 'include'
        });

        if (response.ok) {
          setAccount(null);
        }
      }
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear the account on error
      tokenManager.removeToken();
      setAccount(null);
    }
  };

  if (loading) {
    return (
      <div className="App">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="App">
      {!account ? (
        view === 'login' ? (
          <Login 
            onLogin={handleLogin} 
            onSwitchToRegister={() => setView('register')}
          />
        ) : (
          <Register 
            onRegister={handleRegister}
            onSwitchToLogin={() => setView('login')}
          />
        )
      ) : (
        <Dashboard account={account} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
