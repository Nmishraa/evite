import React, { useState } from 'react';
import { Mail, Lock, User, Sparkles, ArrowRight } from 'lucide-react';
import './Auth.css';

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate auth
    onLogin({ email, name: name || email.split('@')[0] });
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="auth-card glass-card">
        <div className="auth-header">
          <div className="auth-logo">
            <Sparkles className="text-primary" />
            <span>EvitePro</span>
          </div>
          <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
          <p className="text-muted">
            {isLogin ? 'Sign in to manage your events' : 'Join us to start inviting guests'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="input-group">
              <label>Full Name</label>
              <div className="input-with-icon">
                <User size={18} />
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                />
              </div>
            </div>
          )}

          <div className="input-group">
            <label>Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} />
              <input 
                type="email" 
                placeholder="you@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="input-with-icon">
              <Lock size={18} />
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full auth-submit">
            {isLogin ? 'Sign In' : 'Sign Up'}
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <button 
          onClick={() => onLogin({ isGuest: true })} 
          className="btn btn-outline btn-full guest-btn"
        >
          <User size={18} />
          Continue as Guest
        </button>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button onClick={() => setIsLogin(!isLogin)} className="auth-toggle">
              {isLogin ? 'Create Account' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
