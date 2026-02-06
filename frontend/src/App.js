import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      // First check for JWT token
      const authToken = localStorage.getItem('authToken');
      if (authToken) {
        // Verify JWT token
        const jwtResponse = await fetch('/api/auth/verify', {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        
        if (jwtResponse.ok) {
          const jwtData = await jwtResponse.json();
          if (jwtData.success) {
            // Create account object from JWT user data
            const accountData = {
              id: jwtData.user.id,
              username: jwtData.user.email.split('@')[0],
              email: jwtData.user.email,
              isDemo: false,
              wallet: {
                balance: 10000, // Default balance
                currency: 'USD',
                assets: []
              }
            };
            setAccount(accountData);
            setLoading(false);
            return;
          } else {
            // Invalid token, remove it
            localStorage.removeItem('authToken');
          }
        }
      }
      
      // Check for demo account session
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

  const handleLogout = async () => {
    try {
      // Clear JWT token if exists
      localStorage.removeItem('authToken');
      
      // Also logout from demo session if exists
      const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        setAccount(null);
      } else {
        // Even if demo logout fails, still clear account
        setAccount(null);
      }
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear account on error
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
        <Login onLogin={handleLogin} />
      ) : (
        <Dashboard account={account} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
