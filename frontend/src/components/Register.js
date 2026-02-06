import React, { useState } from 'react';
import tokenManager from '../utils/tokenManager';

function Register({ onRegister, onSwitchToLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');

  const checkPasswordStrength = (pass) => {
    if (pass.length === 0) return '';
    if (pass.length < 6) return 'weak';
    if (pass.length >= 6 && pass.length < 10) return 'medium';
    if (pass.length >= 10 && /[A-Z]/.test(pass) && /[0-9]/.test(pass)) return 'strong';
    return 'medium';
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(checkPasswordStrength(newPassword));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
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
        // Pass user data to parent
        onRegister({ ...data.user, isJWT: true });
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

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak': return '#ff4444';
      case 'medium': return '#ffaa00';
      case 'strong': return '#00cc66';
      default: return '#ddd';
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <h1>🥤 JuicyCryptoMarket</h1>
        <p>Create your account</p>
      </div>

      {error && (
        <div className="error-message">{error}</div>
      )}

      <form className="login-form" onSubmit={handleSubmit}>
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
            onChange={handlePasswordChange}
            placeholder="Enter your password (min 6 characters)"
            disabled={loading}
            required
          />
          {passwordStrength && (
            <div className="password-strength">
              <div 
                className="strength-bar" 
                style={{ 
                  width: passwordStrength === 'weak' ? '33%' : passwordStrength === 'medium' ? '66%' : '100%',
                  backgroundColor: getStrengthColor()
                }}
              />
              <span style={{ color: getStrengthColor(), fontSize: '12px', marginTop: '5px' }}>
                {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}
              </span>
            </div>
          )}
        </div>

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

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading || !email || !password || !confirmPassword}
        >
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p style={{ color: '#666', fontSize: '14px' }}>
          Already have an account?{' '}
          <button 
            onClick={onSwitchToLogin}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#4CAF50', 
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;
