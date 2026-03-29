import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Save, Check, Globe, 
  GraduationCap, Briefcase, Rocket, Star,
  Moon, Bell, Shield
} from 'lucide-react';
import './SettingsPage.css';

const SettingsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Sara',
    user_type: 'investor',
    preferred_language: 'English',
    interests: ['stocks', 'startups', 'tech'],
    notifications: true,
    darkMode: false
  });

  const availableInterests = [
    'stocks', 'startups', 'tech', 'crypto', 'real estate', 
    'economy', 'banking', 'policy', 'global', 'mutual funds'
  ];

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('etpulse_profile') || '{}');
    if (Object.keys(saved).length > 0) {
      setProfile(prev => ({ ...prev, ...saved }));
    }
  }, []);

  const handleInterestToggle = (interest) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem('etpulse_profile', JSON.stringify({
        ...profile,
        onboarding_completed: true
      }));
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    }, 800);
  };

  return (
    <div className="settings-container-page">
      <header className="settings-header">
        <button className="icon-btn" onClick={() => navigate('/profile')}>
          <ArrowLeft size={20} />
        </button>
        <h1>Settings</h1>
        <button className="save-btn-top" onClick={handleSave} disabled={loading}>
          {success ? <Check size={20} /> : <Save size={20} />}
        </button>
      </header>

      <main className="settings-main">
        {/* User Type */}
        <section className="settings-section">
          <h3>Your Identity</h3>
          <div className="user-type-grid">
            {[
              { id: 'student', label: 'Student', icon: <GraduationCap size={20} /> },
              { id: 'investor', label: 'Investor', icon: <Briefcase size={20} /> },
              { id: 'founder', label: 'Founder', icon: <Rocket size={20} /> }
            ].map(type => (
              <button 
                key={type.id}
                className={`type-select-card ${profile.user_type === type.id ? 'active' : ''}`}
                onClick={() => setProfile({ ...profile, user_type: type.id })}
              >
                <div className="type-icon">{type.icon}</div>
                <span>{type.label}</span>
                {profile.user_type === type.id && <div className="active-dot" />}
              </button>
            ))}
          </div>
        </section>

        {/* Vernacular Toggle */}
        <section className="settings-section">
          <div className="section-header-row">
            <h3><Globe size={18} /> Preferred Language</h3>
            <span className="vernacular-badge">AI Native</span>
          </div>
          <p className="section-desc">Briefings and chat will adapt to your choice.</p>
          <div className="language-toggle-group">
            {['English', 'Hindi', 'Tamil'].map(lang => (
              <button 
                key={lang}
                className={`lang-btn ${profile.preferred_language === lang ? 'active' : ''}`}
                onClick={() => setProfile({ ...profile, preferred_language: lang })}
              >
                {lang}
              </button>
            ))}
          </div>
        </section>

        {/* Interests */}
        <section className="settings-section">
          <div className="section-header-row">
            <h3>Your Interests</h3>
            <span>{profile.interests.length} selected</span>
          </div>
          <div className="interests-pill-grid">
            {availableInterests.map(interest => (
              <button 
                key={interest}
                className={`interest-pill ${profile.interests.includes(interest) ? 'active' : ''}`}
                onClick={() => handleInterestToggle(interest)}
              >
                {interest}
              </button>
            ))}
          </div>
        </section>

        {/* App Preferences */}
        <section className="settings-section">
          <h3>Preferences</h3>
          <div className="toggle-list">
            <div className="toggle-item">
              <div className="toggle-info">
                <Moon size={18} />
                <span>Dark Mode</span>
              </div>
              <button 
                className={`switch ${profile.darkMode ? 'on' : ''}`}
                onClick={() => setProfile({ ...profile, darkMode: !profile.darkMode })}
              />
            </div>
            <div className="toggle-item">
              <div className="toggle-info">
                <Bell size={18} />
                <span>Notifications</span>
              </div>
              <button 
                className={`switch ${profile.notifications ? 'on' : ''}`}
                onClick={() => setProfile({ ...profile, notifications: !profile.notifications })}
              />
            </div>
          </div>
        </section>

        <button className="save-btn-large" onClick={handleSave} disabled={loading}>
          {loading ? 'Saving Preferences...' : success ? 'Successfully Saved!' : 'Save Changes'}
        </button>
      </main>
    </div>
  );
};

export default SettingsPage;
