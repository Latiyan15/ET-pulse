import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Settings, ChevronRight, BookOpen, 
  MessageSquare, History, Sparkles, TrendingUp,
  Briefcase, Zap, Compass, MapPin, LogOut, Loader2
} from 'lucide-react';
import './ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({});
  const [user, setUser] = useState({});
  const [history, setHistory] = useState([]);
  const [chats, setChats] = useState([]);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem('etpulse_profile') || '{}');
    const savedUser = JSON.parse(localStorage.getItem('etpulse_user') || '{}');
    const savedHistory = JSON.parse(localStorage.getItem('etpulse_history') || '[]');
    const savedChats = JSON.parse(localStorage.getItem('etpulse_chats') || '[]');
    
    setProfile(savedProfile);
    setUser(savedUser);
    setHistory(savedHistory);
    setChats(savedChats);
  }, []);

  const firstName = user.name?.split(' ')[0] || 'There';
  const displayType = profile.user_type === 'business_owner' 
    ? 'Business Owner' 
    : (profile.user_type?.charAt(0).toUpperCase() + profile.user_type?.slice(1)) || 'Reader';

  const handleLogout = () => {
    setIsLoggingOut(true);
    setShowLogoutConfirm(false);
    
    // Smooth transition delay
    setTimeout(() => {
      localStorage.removeItem('etpulse_user');
      localStorage.removeItem('etpulse_profile');
      localStorage.removeItem('etpulse_onboarding_step');
      navigate('/login?loggedOut=true');
    }, 1500);
  };

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <section className="profile-hero">
        <div className="profile-header-top">
          <button className="back-btn-simple" onClick={() => navigate('/home')}>
            <ChevronRight style={{ transform: 'rotate(180deg)' }} /> Home
          </button>
          <button className="settings-trigger" onClick={() => navigate('/settings')}>
            <Settings size={20} />
          </button>
        </div>

        <div className="profile-card">
          <div className="profile-avatar-large">
            {firstName.charAt(0)}
          </div>
          <h1 className="profile-name">{user.name || 'User'}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>
            {user.email || 'user@example.com'}
          </p>
          <div className="profile-badge">
            <Sparkles size={14} /> {displayType} • {profile.preferred_language || 'English'}
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-value">{history.length}</span>
            <span className="stat-label">Briefings</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-value">{chats.length}</span>
            <span className="stat-label">Chats</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-value">{profile.interests?.length || 0}</span>
            <span className="stat-label">Interests</span>
          </div>
        </div>
      </section>

      <main className="profile-main">
        {/* Profile Details */}
        <section className="history-section">
          <div className="section-title-row">
            <h3><Briefcase size={18} /> Your Preferences</h3>
          </div>
          <div style={{ padding: '0 20px', marginBottom: '20px' }}>
            {profile.sectors?.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sectors</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {profile.sectors.map(s => (
                    <span key={s} style={{ background: '#F3F4F6', padding: '4px 12px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '500' }}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {profile.interests?.length > 0 && (
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Interests</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {profile.interests.map(i => (
                    <span key={i} style={{ background: '#F3F4F6', padding: '4px 12px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '500' }}>
                      {i}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Your Briefings History */}
        <section className="history-section">
          <div className="section-title-row">
            <h3><BookOpen size={18} /> Recent Briefings</h3>
            {history.length > 3 && <button className="view-all">All <ChevronRight size={14} /></button>}
          </div>
          
          {history.length === 0 ? (
            <div style={{ padding: '0 20px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>No briefings read yet.</div>
          ) : (
            <div className="history-list">
              {history.slice(0, 5).map((item, idx) => (
                <div key={idx} className="history-card" onClick={() => navigate(`/briefing/${item.id}`)}>
                  <div className="history-icon-box">
                    <TrendingUp size={20} />
                  </div>
                  <div className="history-info">
                    <h4 style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                      {item.title}
                    </h4>
                    <span>{item.date} • {item.type}</span>
                  </div>
                  <ChevronRight size={18} className="chevron" />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Your Conversations */}
        <section className="history-section">
          <div className="section-title-row">
            <h3><MessageSquare size={18} /> Conversations</h3>
            {chats.length > 3 && <button className="view-all">All <ChevronRight size={14} /></button>}
          </div>
          
          {chats.length === 0 ? (
            <div style={{ padding: '0 20px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>No chats started yet.</div>
          ) : (
            <div className="history-list">
              {chats.slice(0, 5).map((chat, idx) => (
                <div key={idx} className="history-card" onClick={() => navigate('/explore')}>
                  <div className="history-icon-box chat-icon">
                    <History size={20} />
                  </div>
                  <div className="history-info">
                    <h4 style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                      {chat.title}
                    </h4>
                    <span>{chat.date} • {chat.messages} messages</span>
                  </div>
                  <ChevronRight size={18} className="chevron" />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Logout Section */}
        <section className="profile-logout-section">
          <button className="logout-btn-subtle" onClick={() => setShowLogoutConfirm(true)}>
            <LogOut size={18} /> Log Out
          </button>
        </section>
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="modal-overlay" onClick={() => setShowLogoutConfirm(false)}>
          <div className="modal-content logout-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-icon-warning">
              <LogOut size={24} />
            </div>
            <h3>Are you sure?</h3>
            <p>You will be logged out of your personalized newsroom.</p>
            <div className="modal-actions">
              <button className="modal-btn-cancel" onClick={() => setShowLogoutConfirm(false)}>Cancel</button>
              <button className="modal-btn-confirm" onClick={handleLogout}>Log Out</button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Transition Overlay */}
      {isLoggingOut && (
        <div className="logout-transition-overlay">
          <div className="transition-content">
            <Loader2 size={40} className="spinning-loader" />
            <p>Logging you out safely...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
