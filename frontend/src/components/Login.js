import React, { useState } from 'react';
import API_ENDPOINTS from '../config/api';

// Default balance for new user accounts
const DEFAULT_USER_BALANCE = 10000;

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleDemoLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(API_ENDPOINTS.demoLogin, {
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

    if (!email || !password) {
      setError('Please provide email and password');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      const data = await response.json();

      if (data.success) {
        // Store JWT token in localStorage
        localStorage.setItem('authToken', data.token);
        // Create account object compatible with existing dashboard
        const accountData = {
          id: data.user.id,
          username: data.user.email.split('@')[0],
          email: data.user.email,
          isDemo: false,
          wallet: {
            balance: DEFAULT_USER_BALANCE,
            currency: 'USD',
            assets: []
          }
        };
        onLogin(accountData);
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

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.register, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      const data = await response.json();

      if (data.success) {
        // Store JWT token in localStorage
        localStorage.setItem('authToken', data.token);
        // Create account object compatible with existing dashboard
        const accountData = {
          id: data.user.id,
          username: data.user.email.split('@')[0],
          email: data.user.email,
          isDemo: false,
          wallet: {
            balance: DEFAULT_USER_BALANCE,
            currency: 'USD',
            assets: []
          }
        };
        onLogin(accountData);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setError('');
    setPassword('');
    setConfirmPassword('');
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

      <form className="login-form" onSubmit={isRegistering ? handleRegister : handleRegularLogin}>
        <h2>{isRegistering ? 'Create Account' : 'Login'}</h2>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={loading}
            required
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
            required
          />
        </div>

        {isRegistering && (
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              disabled={loading}
              required
            />
          </div>
        )}

        <div className="login-buttons">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading || !email || !password || (isRegistering && !confirmPassword)}
          >
            {loading ? (isRegistering ? 'Creating Account...' : 'Logging in...') : (isRegistering ? 'Register' : 'Login')}
          </button>

          <button 
            type="button"
            className="btn btn-secondary"
            onClick={toggleMode}
            disabled={loading}
            style={{ marginTop: '10px' }}
          >
            {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
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
            🎮 Try Demo Account
          </button>
        </div>
      </form>

      <div style={{ marginTop: '20px', textAlign: 'center', color: '#999', fontSize: '14px' }}>
        <p>Demo account: $10,000 virtual funds • No signup required</p>
        <p>Real account: Full features • Secure authentication</p>
      </div>
    </div>
  );
}

export default Login;
