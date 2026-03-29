import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';
import HomePage from './pages/HomePage';
import BriefingPage from './pages/BriefingPage';
import ExplorePage from './pages/ExplorePage';
import ArticlePage from './pages/ArticlePage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import './index.css';

import { useEffect } from 'react';

// Guard component to check onboarding status
const OnboardingGuard = ({ children }) => {
  const profile = JSON.parse(localStorage.getItem('etpulse_profile') || '{}');
  const user = JSON.parse(localStorage.getItem('etpulse_user') || '{}');

  // If no user, send to login
  if (!user.email) return <Navigate to="/login" replace />;

  // If onboarding not completed OR skipped, send to onboarding
  // If it's skipped, we allow them to pass to home
  if (!profile.onboarding_completed && !profile.onboarding_skipped) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};

function App() {
  // Sync scroll position to CSS variable for parallax effects
  useEffect(() => {
    const handleScroll = () => {
      document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Global Dynamic Background Layers */}
      <div className="dynamic-newspaper-bg" aria-hidden="true"></div>
      <div className="dynamic-bg-gradient" aria-hidden="true"></div>
      
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/briefing/:id" element={<BriefingPage />} />
          <Route path="/article/:id" element={<ArticlePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route 
            path="/home" 
            element={
              <OnboardingGuard>
                <HomePage />
              </OnboardingGuard>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <OnboardingGuard>
                <ProfilePage />
              </OnboardingGuard>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <OnboardingGuard>
                <SettingsPage />
              </OnboardingGuard>
            } 
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
