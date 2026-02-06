import React, { useState } from 'react';
import tokenManager from '../utils/tokenManager';

function Login({ onLogin, onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDemoLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/demo-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      const data = await response.json();

      if (data.success) {
        onLogin(data.account);
      } else {
        setError(data.message || 'Failed to create demo account');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Demo login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegularLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!email || !password) {
      setError('Please enter email and password');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        // Store JWT token
        tokenManager.setToken(data.token);
        // Pass user data to parent with JWT flag
        onLogin({ ...data.user, isJWT: true });
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <h1>🥤 JuicyCryptoMarket</h1>
        <p>Your gateway to cryptocurrency trading</p>
      </div>

      {error && (
        <div className="error-message">{error}</div>
      )}

      <form className="login-form" onSubmit={handleRegularLogin}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            disabled={loading}
          />
        </div>

        <div className="login-buttons">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading || !email || !password}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="divider">
            <span>OR</span>
          </div>

          <button 
            type="button"
            className="btn btn-demo"
            onClick={handleDemoLogin}
            disabled={loading}
          >
            🎮 Login as Demo Account
          </button>
        </div>
      </form>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p style={{ color: '#666', fontSize: '14px' }}>
          Don't have an account?{' '}
          <button 
            onClick={onSwitchToRegister}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#4CAF50', 
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Register here
          </button>
        </p>
        <p style={{ marginTop: '10px', color: '#999', fontSize: '14px' }}>
          Try our demo account with $10,000 virtual funds!<br/>
          No signup required • Risk-free trading • Full features
        </p>
      </div>
    </div>
  );
}

export default Login;
