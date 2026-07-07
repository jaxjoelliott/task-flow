import React, { useState } from 'react';
import axios from 'axios';

const AuthForm = ({ apiBaseUrl, onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin ? { email, password } : { name, email, password };
      const res = await axios.post(`${apiBaseUrl}${endpoint}`, payload);
      onAuthSuccess(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="card auth-card">
      <div className="wordmark" style={{ marginBottom: 'var(--space-4)' }}>
        <span className="wordmark-dot" />
        Task Flow
      </div>
      <h2>{isLogin ? 'Welcome back' : 'Create your account'}</h2>
      <p className="auth-sub">
        {isLogin ? 'Log in to pick up where you left off.' : 'Start organizing your work in minutes.'}
      </p>
      <form onSubmit={handleSubmit} className="form">
        {!isLogin && (
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required={!isLogin}
            />
          </div>
        )}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="inline-alert">{error}</p>}
        <button type="submit" className="primary-button" style={{ width: '100%' }}>
          {isLogin ? 'Log in' : 'Create account'}
        </button>
      </form>
      <p className="auth-switch">
        {isLogin ? "Don't have an account? " : 'Already have an account? '}
        <button type="button" className="link-button" onClick={() => setIsLogin((prev) => !prev)}>
          {isLogin ? 'Register' : 'Log in'}
        </button>
      </p>
    </div>
  );
};

export default AuthForm;
