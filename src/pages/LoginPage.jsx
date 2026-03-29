import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Sparkles } from 'lucide-react';
import './LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('loggedOut') === 'true') {
      setLogoutMessage(true);
      setIsLogin(true); // Default to login if logging out

      // Auto-hide message after 5 seconds
      const timer = setTimeout(() => setLogoutMessage(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [location]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.email && formData.password) {
      setIsAuthenticating(true);
      
      // Simulate network request / authentication delay
      setTimeout(() => {
        localStorage.setItem('etpulse_user', JSON.stringify({
          name: formData.name || 'Investor',
          email: formData.email,
        }));
        navigate('/onboarding');
      }, 1200);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="login-page">
      {/* Left Panel — Gradient + Branding */}
      <div className="login-left">
        <div className="gradient-bg"></div>

        {/* Water Wave Effect */}
        <div className="water-waves">
          <div className="wave"></div>
          <div className="wave"></div>
          <div className="wave"></div>
          <div className="wave"></div>
        </div>

        {/* Floating Particles */}
        <div className="particles">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>

        {/* Sparkle decorations */}
        <div className="sparkle sparkle-1">
          <Sparkles size={24} />
        </div>
        <div className="sparkle sparkle-2">
          <Sparkles size={14} />
        </div>
        <div className="sparkle sparkle-3">
          <Sparkles size={10} />
        </div>

        {/* Brand Logo */}
        <div className="brand-container">
          <div className="brand-logo">
            <div className="logo-circle">ET</div>
            <h1 className="logo-text">Pulse</h1>
          </div>
          <p className="brand-tagline">Your Market Intelligence</p>
        </div>
      </div>

      {/* Right Panel — Auth Form */}
      <div className="login-right">
        <div className="form-container">
          <div className="form-header">
            <h2>{isLogin ? 'Welcome back' : 'Get started'}</h2>
            <p>{isLogin ? 'Sign in to your personalized newsroom' : 'Smarter insights. Less scrolling. Better decisions.'}</p>
          </div>

          {logoutMessage && (
            <div className="logout-success-alert" style={{
              background: 'rgba(16, 185, 129, 0.1)',
              color: '#059669',
              padding: '12px 16px',
              borderRadius: '12px',
              marginBottom: '20px',
              fontSize: '0.9rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              animation: 'fadeInDown 0.4s ease-out'
            }}>
              <div style={{ width: '8px', height: '8px', background: '#10B981', borderRadius: '50%' }}></div>
              You've been logged out successfully.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group" style={{ animation: 'fadeInUp 0.4s var(--ease-out)' }}>
                <label className="form-label" htmlFor="name">Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="form-input"
                  placeholder="Riya Thakur"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div className="password-field">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className={`submit-btn ${isAuthenticating ? 'loading' : ''}`}
              disabled={isAuthenticating}
            >
              {isAuthenticating ? (
                <div className="btn-loader">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <div className="divider">
            <div className="divider-line"></div>
            <span className="divider-text">or continue with</span>
            <div className="divider-line"></div>
          </div>

          <div className="social-buttons">
            <button className="social-btn" type="button">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </button>
            <button className="social-btn" type="button">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              Apple
            </button>
          </div>

          <div className="auth-toggle">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button type="button" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
