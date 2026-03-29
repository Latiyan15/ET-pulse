import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveProfile } from '../utils/api';
import { Check, X, Info, TrendingUp, BarChart3, Zap, Sparkles, GraduationCap, Rocket, Briefcase, Building2, Search as SearchIcon } from 'lucide-react';
import {
  sectors, investorTypes, userTypes,
  studentQuestions, founderQuestions, professionalQuestions,
  businessOwnerQuestions, readerQuestions,
  getInterestOptions, languageOptions,
  studentGoalsByStream,
} from '../data/mockData';
import './OnboardingPage.css';

// Import sector icons
import bankingIcon from '../assets/icons/banking.png';
import itIcon from '../assets/icons/it.png';
import pharmaIcon from '../assets/icons/pharma.png';
import autoIcon from '../assets/icons/auto.png';
import fmcgIcon from '../assets/icons/fmcg.png';
import energyIcon from '../assets/icons/energy.png';

const sectorIcons = {
  banking: bankingIcon,
  it: itIcon,
  pharma: pharmaIcon,
  auto: autoIcon,
  fmcg: fmcgIcon,
  energy: energyIcon,
};

// SVG fallback icons for sectors without generated images
function RealEstateSVG() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="28" width="20" height="28" rx="2" fill="#C084FC" opacity="0.8" />
      <rect x="12" y="32" width="5" height="5" rx="1" fill="white" opacity="0.6" />
      <rect x="19" y="32" width="5" height="5" rx="1" fill="white" opacity="0.6" />
      <rect x="12" y="40" width="5" height="5" rx="1" fill="white" opacity="0.6" />
      <rect x="19" y="40" width="5" height="5" rx="1" fill="white" opacity="0.6" />
      <rect x="15" y="48" width="6" height="8" rx="1" fill="white" opacity="0.4" />
      <rect x="32" y="16" width="24" height="40" rx="2" fill="#A855F7" opacity="0.9" />
      <rect x="36" y="20" width="5" height="4" rx="1" fill="white" opacity="0.5" />
      <rect x="43" y="20" width="5" height="4" rx="1" fill="white" opacity="0.5" />
      <rect x="36" y="28" width="5" height="4" rx="1" fill="white" opacity="0.5" />
      <rect x="43" y="28" width="5" height="4" rx="1" fill="white" opacity="0.5" />
      <rect x="36" y="36" width="5" height="4" rx="1" fill="white" opacity="0.5" />
      <rect x="43" y="36" width="5" height="4" rx="1" fill="white" opacity="0.5" />
      <rect x="36" y="44" width="5" height="4" rx="1" fill="white" opacity="0.5" />
      <rect x="43" y="44" width="5" height="4" rx="1" fill="white" opacity="0.5" />
      <rect x="40" y="50" width="8" height="6" rx="1" fill="white" opacity="0.3" />
      <polygon points="18,28 8,28 18,18" fill="#D8B4FE" opacity="0.7" />
      <polygon points="44,16 32,16 44,6" fill="#D8B4FE" opacity="0.7" />
    </svg>
  );
}

function MetalsSVG() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="40" width="52" height="8" rx="3" fill="#D4AF37" opacity="0.9" />
      <rect x="6" y="40" width="52" height="3" rx="1.5" fill="#FFD700" opacity="0.4" />
      <rect x="10" y="30" width="44" height="8" rx="3" fill="#D4AF37" opacity="0.85" />
      <rect x="10" y="30" width="44" height="3" rx="1.5" fill="#FFD700" opacity="0.3" />
      <rect x="14" y="20" width="36" height="8" rx="3" fill="#C0C0C0" opacity="0.85" />
      <rect x="14" y="20" width="36" height="3" rx="1.5" fill="white" opacity="0.3" />
      <rect x="18" y="10" width="28" height="8" rx="3" fill="#C0C0C0" opacity="0.8" />
      <rect x="18" y="10" width="28" height="3" rx="1.5" fill="white" opacity="0.25" />
      <line x1="6" y1="50" x2="58" y2="50" stroke="#9CA3AF" strokeWidth="2" opacity="0.3" />
    </svg>
  );
}

const fallbackIcons = {
  realestate: <RealEstateSVG />,
  metals: <MetalsSVG />,
};

const popularStocks = [
  'Reliance', 'TCS', 'HDFC Bank', 'Infosys', 'ICICI Bank',
  'SBI', 'ITC', 'Bharti Airtel', 'HUL', 'Wipro',
  'Tata Motors', 'Sun Pharma', 'Bajaj Finance', 'Asian Paints',
];

// Get path-specific questions based on user type
function getPathQuestions(userType) {
  switch (userType) {
    case 'student': return studentQuestions;
    case 'founder': return founderQuestions;
    case 'professional': return professionalQuestions;
    case 'business_owner': return businessOwnerQuestions;
    case 'reader': return readerQuestions;
    case 'investor': return []; // investor has custom steps
    default: return [];
  }
}

function getInvestorStepCount() {
  return 3;
}

function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Step 1 — User type
  const [userType, setUserType] = useState('');

  // Investor path states
  const [stockInput, setStockInput] = useState('');
  const [stocks, setStocks] = useState([]);
  const [hasMf, setHasMf] = useState(null);
  const [mfCategories, setMfCategories] = useState([]);
  const [investorType, setInvestorType] = useState('');

  // Generic path answers (keyed by question id)
  const [pathAnswers, setPathAnswers] = useState({});

  // Shared steps
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [interests, setInterests] = useState([]);
  const [languages, setLanguages] = useState(['en']);

  // User name from login
  const userName = useMemo(() => {
    try {
      const u = JSON.parse(localStorage.getItem('etpulse_user'));
      return u?.name?.split(' ')[0] || 'there';
    } catch { return 'there'; }
  }, []);

  // Compute step layout
  const pathQuestions = useMemo(() => getPathQuestions(userType), [userType]);
  const pathStepCount = useMemo(() => {
    if (userType === 'investor') return getInvestorStepCount();
    return pathQuestions.length;
  }, [userType, pathQuestions]);

  // Total steps: 1 (user type) + path steps + 4 shared (sectors, interests, language, preview)
  const totalSteps = useMemo(() => 1 + pathStepCount + 4, [pathStepCount]);

  // Which "phase" is current step in?
  const getStepPhase = useCallback(() => {
    if (step === 1) return 'user_type';
    if (step <= 1 + pathStepCount) return 'path';
    const sharedIdx = step - 1 - pathStepCount;
    if (sharedIdx === 1) return 'sectors';
    if (sharedIdx === 2) return 'interests';
    if (sharedIdx === 3) return 'language';
    if (sharedIdx === 4) return 'preview';
    return 'unknown';
  }, [step, pathStepCount]);

  const phase = getStepPhase();
  const pathStepIdx = step - 2;

  // Personalised interest options based on user type
  const interestOptions = useMemo(() => getInterestOptions(userType), [userType]);

  // Togglers
  const toggleSector = (id) => setSelectedSectors(p => p.includes(id) ? p.filter(s => s !== id) : [...p, id]);
  const toggleInterest = (item) => setInterests(p => p.includes(item) ? p.filter(s => s !== item) : [...p, item]);
  const toggleLanguage = (id) => setLanguages(p => p.includes(id) ? p.filter(s => s !== id) : [...p, id]);

  // Path answer handlers
  const setPathSingle = (qId, val) => setPathAnswers(p => ({ ...p, [qId]: val }));
  const togglePathMulti = (qId, val) => {
    setPathAnswers(p => {
      const curr = p[qId] || [];
      return { ...p, [qId]: curr.includes(val) ? curr.filter(v => v !== val) : [...curr, val] };
    });
  };

  // Stock handlers
  const handleStockInput = (e) => {
    const val = e.target.value;
    setStockInput(val);
    if (val.includes(',')) {
      const parts = val.split(',').map(s => s.trim()).filter(Boolean);
      const newStocks = parts.slice(0, -1);
      setStocks(prev => [...new Set([...prev, ...newStocks])]);
      setStockInput(parts[parts.length - 1] || '');
    }
  };
  const handleStockKeyDown = (e) => {
    if (e.key === 'Enter' && stockInput.trim()) {
      setStocks(prev => [...new Set([...prev, stockInput.trim()])]);
      setStockInput('');
    }
  };
  const removeStock = (stock) => setStocks(prev => prev.filter(s => s !== stock));
  const togglePopularStock = (stock) => {
    if (stocks.includes(stock)) setStocks(prev => prev.filter(s => s !== stock));
    else setStocks(prev => [...prev, stock]);
  };

  // MF categories
  const mfOptions = ['Large Cap', 'Mid Cap', 'Small Cap', 'ELSS', 'Flexi Cap', 'Index Fund', 'Debt Fund'];
  const toggleMfCat = (cat) => setMfCategories(p => p.includes(cat) ? p.filter(c => c !== cat) : [...p, cat]);

  const handleNext = async () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      const profile = {
        user_type: userType,
        sectors: selectedSectors,
        interests,
        languages,
        onboarding_completed: true,
        created_at: new Date().toISOString()
      };

      // Path specific data
      if (userType === 'investor') {
        profile.stocks = stocks;
        profile.investor_type = investorType;
        profile.has_mf = hasMf;
        profile.mf_categories = mfCategories;
      } else {
        Object.assign(profile, pathAnswers);
      }

      try {
        await saveProfile(profile);
      } catch (err) {
        console.error("Failed to save profile to backend:", err);
      }

      localStorage.setItem('etpulse_profile', JSON.stringify(profile));
      navigate('/home', { state: { showSplashTransition: true } });
    }
  };

  const handleSkip = () => {
    const profile = {
      user_type: 'reader',
      sectors: ['it', 'banking'], // Default sectors for generic view
      onboarding_completed: false,
      onboarding_skipped: true,
      created_at: new Date().toISOString()
    };
    localStorage.setItem('etpulse_profile', JSON.stringify(profile));
    navigate('/home', { state: { showSplashTransition: true } });
  };

  // Resume from partial onboarding
  useEffect(() => {
    const savedStep = localStorage.getItem('etpulse_onboarding_step');
    if (savedStep && !JSON.parse(localStorage.getItem('etpulse_profile') || '{}').onboarding_completed) {
      setStep(parseInt(savedStep));
    }
  }, []);

  // Save current step for partial resume
  useEffect(() => {
    localStorage.setItem('etpulse_onboarding_step', step.toString());
  }, [step]);

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  // Disable next logic
  const isNextDisabled = useMemo(() => {
    if (phase === 'user_type') return !userType;
    if (phase === 'sectors') return selectedSectors.length === 0;
    if (phase === 'language') return languages.length === 0;
    if (phase === 'path') {
      if (userType === 'investor') {
        const investorStep = step - 1;
        if (investorStep === 3) return !investorType;
        return false;
      }
      const q = pathQuestions[pathStepIdx];
      if (!q) return false;
      if (q.type === 'single') return !pathAnswers[q.id];
      if (q.type === 'multi') return !(pathAnswers[q.id]?.length > 0);
    }
    return false;
  }, [phase, userType, selectedSectors, investorType, pathStepIdx, pathQuestions, pathAnswers, step, languages]);

  const progressPercent = (step / totalSteps) * 100;

  const getProgressLabels = () => {
    const labels = ['You'];
    if (userType === 'investor') labels.push('Stocks', 'MF', 'Style');
    else if (userType === 'student') labels.push('Study', 'Goal');
    else if (userType === 'founder') labels.push('Stage', 'Space', 'News');
    else if (userType === 'professional') labels.push('Role', 'Level');
    else if (userType === 'business_owner') labels.push('Biz', 'Focus');
    else if (userType === 'reader') labels.push('Why');
    else labels.push('...');
    labels.push('Sectors', 'Interests', 'Language', 'Preview');
    return labels;
  };

  const getInvestorIcon = (iconName, color) => {
    const props = { size: 28, color };
    switch (iconName) {
      case 'TrendingUp': return <TrendingUp {...props} />;
      case 'BarChart3': return <BarChart3 {...props} />;
      case 'Zap': return <Zap {...props} />;
      default: return null;
    }
  };

  // ==================== RENDER ====================

  const renderUserTypeIcon = (id) => {
    const props = { size: 28, strokeWidth: 1.5, className: "ut-lucide-icon" };
    switch (id) {
      case 'investor': return <TrendingUp {...props} />;
      case 'student': return <GraduationCap {...props} />;
      case 'founder': return <Rocket {...props} />;
      case 'professional': return <Briefcase {...props} />;
      case 'business_owner': return <Building2 {...props} />;
      case 'reader': return <SearchIcon {...props} />;
      default: return null;
    }
  };

  const renderUserTypeStep = () => (
    <div className="step-content" key="user-type">
      <h2 className="step-title">Hey {userName}, what describes you best?</h2>
      <p className="step-subtitle">This shapes everything about your briefings</p>
      <div className="user-type-grid">
        {userTypes.map((ut, i) => (
          <div
            key={ut.id}
            className={`user-type-card ${userType === ut.value ? 'selected' : ''}`}
            onClick={() => setUserType(ut.value)}
            style={{ animationDelay: `${i * 0.06}s` }}
          >
            <div className="ut-icon">{renderUserTypeIcon(ut.id)}</div>
            <div className="ut-text">
              <div className="ut-label">{ut.label}</div>
              <div className="ut-sub">{ut.sub}</div>
            </div>
            <div className={`ut-check ${userType === ut.value ? 'checked' : 'unchecked'}`}>
              {userType === ut.value && <Check size={13} strokeWidth={3} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Investor custom steps
  const renderInvestorStep = () => {
    const investorStep = step - 1;

    if (investorStep === 1) {
      return (
        <div className="step-content" key="inv-stocks">
          <h2 className="step-title">Which stocks are in your portfolio?</h2>
          <p className="step-subtitle">We'll surface relevant news for your holdings.</p>
          <div className="portfolio-input-container">
            <input
              type="text"
              className="portfolio-textarea"
              style={{ minHeight: '50px' }}
              placeholder="Type stock names and press Enter or comma..."
              value={stockInput}
              onChange={handleStockInput}
              onKeyDown={handleStockKeyDown}
            />
            {stocks.length > 0 && (
              <div className="portfolio-chips">
                {stocks.map((stock, i) => (
                  <span key={i} className="portfolio-chip" style={{ animationDelay: `${i * 0.05}s` }}>
                    {stock}
                    <button className="chip-remove" onClick={() => removeStock(stock)}>
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="portfolio-hint">
              <Info size={14} />
              <span>Separate stocks with commas or press Enter</span>
            </div>
            <div className="popular-stocks">
              <div className="popular-stocks-title">Popular picks</div>
              <div className="popular-stock-chips">
                {popularStocks.map((stock) => (
                  <button
                    key={stock}
                    className={`popular-chip ${stocks.includes(stock) ? 'added' : ''}`}
                    onClick={() => togglePopularStock(stock)}
                  >
                    {stocks.includes(stock) ? '✓ ' : '+ '}{stock}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (investorStep === 2) {
      return (
        <div className="step-content" key="inv-mf">
          <h2 className="step-title">Do you invest in mutual funds?</h2>
          <p className="step-subtitle">We'll include MF-relevant insights in your briefings.</p>
          <div className="mf-choice-grid">
            <div
              className={`path-card ${hasMf === true ? 'selected' : ''}`}
              onClick={() => setHasMf(true)}
            >
              <div className="path-card-label">Yes, I do</div>
              <div className="path-card-sub">I invest in mutual funds regularly</div>
            </div>
            <div
              className={`path-card ${hasMf === false ? 'selected' : ''}`}
              onClick={() => setHasMf(false)}
            >
              <div className="path-card-label">Not yet</div>
              <div className="path-card-sub">I don't invest in mutual funds</div>
            </div>
          </div>
          {hasMf && (
            <div className="mf-categories" style={{ animation: 'fadeInUp 0.4s var(--ease-out)' }}>
              <div className="mf-cat-title">What categories do you hold?</div>
              <div className="multi-select-chips">
                {mfOptions.map(cat => (
                  <button
                    key={cat}
                    className={`multi-chip ${mfCategories.includes(cat) ? 'selected' : ''}`}
                    onClick={() => toggleMfCat(cat)}
                  >
                    {mfCategories.includes(cat) && <Check size={12} />}
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (investorStep === 3) {
      return (
        <div className="step-content" key="inv-type">
          <h2 className="step-title">What kind of investor are you?</h2>
          <p className="step-subtitle">This helps us tailor the depth and frequency of your briefings.</p>
          <div className="investor-grid">
            {investorTypes.map((type) => (
              <div
                key={type.id}
                className={`investor-card ${investorType === type.id ? 'selected' : ''}`}
                onClick={() => setInvestorType(type.id)}
              >
                <div className="investor-icon" style={{ background: `${type.color}15` }}>
                  {getInvestorIcon(type.icon, type.color)}
                </div>
                <h3>{type.title}</h3>
                <p>{type.description}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  // Generic path question step
  const renderPathQuestion = () => {
    let q = pathQuestions[pathStepIdx];
    if (!q) return null;

    // Dynamic Student Goals
    if (userType === 'student' && q.id === 'study_goal') {
      const stream = pathAnswers.study_stream;
      const dynamicOptions = studentGoalsByStream[stream] || [];
      q = { ...q, options: dynamicOptions };
    }

    if (q.type === 'single') {
      return (
        <div className="step-content" key={q.id + (userType === 'student' && q.id === 'study_goal' ? pathAnswers.study_stream : '')}>
          <h2 className="step-title">{q.title}</h2>
          <p className="step-subtitle">{q.subtitle}</p>
          <div className="path-cards-grid">
            {q.options.map((opt, i) => (
              <div
                key={opt.id}
                className={`path-card ${pathAnswers[q.id] === opt.id ? 'selected' : ''}`}
                onClick={() => setPathSingle(q.id, opt.id)}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="path-card-label">{opt.label}</div>
                {opt.sub && <div className="path-card-sub">{opt.sub}</div>}
                <div className={`path-card-check ${pathAnswers[q.id] === opt.id ? 'checked' : 'unchecked'}`}>
                  {pathAnswers[q.id] === opt.id && <Check size={12} strokeWidth={3} />}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (q.type === 'multi') {
      const selected = pathAnswers[q.id] || [];
      return (
        <div className="step-content" key={q.id}>
          <h2 className="step-title">{q.title}</h2>
          <p className="step-subtitle">{q.subtitle}</p>
          <div className="multi-select-chips">
            {q.options.map((opt) => (
              <button
                key={opt.id}
                className={`multi-chip ${selected.includes(opt.id) ? 'selected' : ''}`}
                onClick={() => togglePathMulti(q.id, opt.id)}
              >
                {selected.includes(opt.id) && <Check size={12} />}
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  // Sectors step (preserved from original)
  const renderSectors = () => (
    <div className="step-content" key="sectors">
      <h2 className="step-title">What sectors interest you most?</h2>
      <p className="step-subtitle">Select the sectors you follow. We'll personalize your news feed.</p>
      <div className="sector-grid">
        {sectors.map((sector) => (
          <div
            key={sector.id}
            className={`sector-tile ${selectedSectors.includes(sector.id) ? 'selected' : ''}`}
            onClick={() => toggleSector(sector.id)}
          >
            <div className="tile-bg" style={{ background: sector.gradient }}></div>
            {sectorIcons[sector.id] ? (
              <img src={sectorIcons[sector.id]} alt={sector.name} className="tile-icon" />
            ) : (
              <div className="tile-icon-svg">{fallbackIcons[sector.id]}</div>
            )}
            <div className="tile-label-bar">
              <span className="tile-label">{sector.name}</span>
              <div className={`tile-check ${selectedSectors.includes(sector.id) ? 'checked' : 'unchecked'}`}>
                {selectedSectors.includes(sector.id) && <Check size={13} strokeWidth={3} />}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Personalised interests step — options based on user type
  const renderInterests = () => {
    const typeLabels = {
      investor: 'investor',
      student: 'student',
      founder: 'founder',
      professional: 'professional',
      business_owner: 'business owner',
      reader: '',
    };
    const typeLabel = typeLabels[userType] || '';
    return (
      <div className="step-content" key="interests">
        <h2 className="step-title">What would you like to receive?</h2>
        <p className="step-subtitle">
          {typeLabel ? `Curated for you as a ${typeLabel}. ` : ''}Select the updates that matter most.
        </p>
        <div className="multi-select-chips interest-chips">
          {interestOptions.map((item) => (
            <button
              key={item}
              className={`multi-chip ${interests.includes(item) ? 'selected' : ''}`}
              onClick={() => toggleInterest(item)}
            >
              {interests.includes(item) && <Check size={12} />}
              {item}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Language step — multi-select
  const renderLanguage = () => (
    <div className="step-content" key="language">
      <h2 className="step-title">Preferred briefing languages</h2>
      <p className="step-subtitle">Select all languages you'd like briefings in.</p>
      <div className="language-grid">
        {languageOptions.map((lang) => (
          <div
            key={lang.id}
            className={`path-card ${languages.includes(lang.id) ? 'selected' : ''}`}
            onClick={() => toggleLanguage(lang.id)}
          >
            <div className="path-card-label">{lang.label}</div>
            <div className="path-card-sub">{lang.sub}</div>
            <div className={`path-card-check ${languages.includes(lang.id) ? 'checked' : 'unchecked'}`}>
              {languages.includes(lang.id) && <Check size={12} strokeWidth={3} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Preview step
  const renderPreview = () => {
    const typeLabels = {
      investor: 'Retail Investor',
      student: 'Student',
      founder: 'Startup Founder',
      professional: 'Finance Professional',
      business_owner: 'Business Owner',
      reader: 'Curious Reader',
    };
    return (
      <div className="step-content" key="preview">
        <h2 className="step-title">Your personalised ET Pulse is ready!</h2>
        <p className="step-subtitle">Here's a preview of how we'll tailor your experience.</p>
        <div className="preview-card">
          <div className="preview-header">
            <Sparkles size={20} className="preview-sparkle" />
            <span>Personalised Briefing Preview</span>
          </div>
          <div className="preview-body">
            <div className="preview-row">
              <span className="preview-label">Profile</span>
              <span className="preview-value">{typeLabels[userType] || 'Reader'}</span>
            </div>
            <div className="preview-row">
              <span className="preview-label">Sectors</span>
              <span className="preview-value">{selectedSectors.length > 0 ? selectedSectors.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ') : 'All'}</span>
            </div>
            {userType === 'investor' && stocks.length > 0 && (
              <div className="preview-row">
                <span className="preview-label">Portfolio</span>
                <span className="preview-value">{stocks.join(', ')}</span>
              </div>
            )}
            <div className="preview-row">
              <span className="preview-label">Languages</span>
              <span className="preview-value">{languages.map(l => languageOptions.find(lo => lo.id === l)?.label).filter(Boolean).join(', ')}</span>
            </div>
            {interests.length > 0 && (
              <div className="preview-row">
                <span className="preview-label">Interests</span>
                <span className="preview-value">{interests.slice(0, 3).join(', ')}{interests.length > 3 ? ` +${interests.length - 3}` : ''}</span>
              </div>
            )}
          </div>
          <div className="preview-sample">
            <div className="preview-sample-label">Sample briefing tone:</div>
            <div className="preview-sample-text">
              {userType === 'investor' && '"RBI holds rates — your HDFC Bank holding benefits from stable NIMs. Watch for Q4 results on April 20."'}
              {userType === 'student' && '"RBI holds rates at 6.5% (repo rate = the rate at which RBI lends to banks). Why should students care? This is a frequent exam topic."'}
              {userType === 'founder' && '"RBI rate hold signals stable lending environment. If you\'re raising debt for your startup, this is favourable timing."'}
              {userType === 'professional' && '"MPC holds at 6.5%. Forward guidance dovish. 10Y G-Sec at 7.08%. FII net flows: -₹2,840 Cr (3-day trailing)."'}
              {userType === 'business_owner' && '"RBI holds rates — your floating rate business loan EMI stays unchanged this quarter. Next review: June MPC."'}
              {userType === 'reader' && '"RBI kept interest rates the same. This means your home loan EMI won\'t change this month."'}
              {!userType && '"Your personalised briefing will appear here."'}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main step renderer
  const renderStep = () => {
    if (phase === 'user_type') return renderUserTypeStep();
    if (phase === 'path') {
      if (userType === 'investor') return renderInvestorStep();
      return renderPathQuestion();
    }
    if (phase === 'sectors') return renderSectors();
    if (phase === 'interests') return renderInterests();
    if (phase === 'language') return renderLanguage();
    if (phase === 'preview') return renderPreview();
    return null;
  };

  const isLastStep = step === totalSteps;
  const canSkip = phase === 'path' && userType === 'investor' && (step - 1) <= 2;

  return (
    <div className="onboarding-page">
      <div className="onboarding-header">
        <div className="onboarding-brand">
          <div className="ob-logo-circle">ET</div>
          <span className="ob-logo-text">Pulse</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar-container">
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
        <div className="progress-labels">
          {getProgressLabels().map((label, i) => {
            const labelStep = i + 1;
            let cls = 'progress-label';
            if (labelStep < step) cls += ' done';
            else if (labelStep === step) cls += ' active';
            return <span key={i} className={cls}>{label}</span>;
          })}
        </div>
      </div>

      {/* Step Content */}
      {renderStep()}

      {/* Navigation */}
      <div className="onboarding-nav">
        {step > 1 ? (
          <button className="nav-btn nav-btn-back" onClick={handleBack}>Back</button>
        ) : (
          <div></div>
        )}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {step === 1 && (
            <button className="nav-btn-skip-text" onClick={handleSkip}>Skip for Now</button>
          )}
          {canSkip && (
            <button className="nav-btn nav-btn-skip" onClick={handleNext}>Skip</button>
          )}
          <button
            className="nav-btn nav-btn-next"
            onClick={handleNext}
            disabled={isNextDisabled}
          >
            {isLastStep ? 'Start Reading' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default OnboardingPage;
