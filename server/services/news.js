const axios = require('axios');
const GeminiService = require('./gemini');
require('dotenv').config();

const GNEWS_API_KEY = process.env.GNEWS_API_KEY;
const GNEWS_BASE = 'https://gnews.io/api/v4';

// =====================================================
// Sector → GNews search query keyword map
// =====================================================
const SECTOR_KEYWORDS = {
  banking: 'RBI HDFC SBI ICICI "Axis Bank" PNB "Kotak Mahindra"',
  it: 'TCS Infosys Wipro HCLTech LTIMindtree Cognizant "Tech Mahindra"',
  pharma: 'Cipla "Sun Pharma" Zydus "Dr Reddys" Lupin USFDA Aurobindo',
  auto: '"Tata Motors" Mahindra Maruti "Hero MotoCorp" EV "Electric Vehicle" Suzuki',
  fmcg: 'Nestle Unilever Dabur ITC Britannia FMCG Retail',
  energy: 'Reliance Adani Solar Power Energy Utility Wind',
  realestate: 'DLF Godrej Oberoi Macrotech RealEstate Property construction',
  metals: '"Tata Steel" JSW Vedanta Hindalco Metals Mining Aluminium',
  markets: 'Sensex Nifty NSE BSE FII DII Trading Markets Stocks',
};

// Interest → search keywords
const INTEREST_KEYWORDS = {
  'Daily market digest': 'Indian stock market today Sensex Nifty',
  'Portfolio watchlist alerts': 'stock alerts earnings results India',
  'Earnings calendar & results': 'quarterly results earnings India',
  'Funding round tracker': 'startup funding VC investment India',
  'GST & tax updates': 'GST tax government policy India',
  'Concept explainers': 'economy explained market basics India',
};

// =====================================================
// In-memory cache to respect GNews rate limits (100/day)
// =====================================================
const cache = new Map();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

function getCached(key) {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.ts < CACHE_TTL) {
    console.log(`📦 Cache hit: "${key}"`);
    return entry.data;
  }
  return null;
}
function setCache(key, data) {
  cache.set(key, { data, ts: Date.now() });
}

// =====================================================
// Query Cleaning (prevents GNews 400 errors)
// =====================================================
function cleanQuery(query) {
  if (!query) return '';
  // Keep ONLY letters, numbers, and spaces. Remove EVERYTHING else (symbols, emojis, !, ?, etc.)
  let cleaned = query.replace(/[^a-zA-Z0-9\s]/g, ' ');
  // Truncate to first 6-8 words for maximum search accuracy in GNews
  cleaned = cleaned.trim().split(/\s+/).slice(0, 8).join(' ');
  return cleaned;
}

// =====================================================
// Utility
// =====================================================
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Detect sector from article title/description using keyword matching.
 */
function detectSector(title = '', description = '') {
  // STRICT: Only match against the TITLE to prevent cross-sector leaks
  // Content-only matches are ignored for categorization
  const titleText = title || '';
  const sectorScores = {};
  
  for (const [sector, keywords] of Object.entries(SECTOR_KEYWORDS)) {
    // Split keywords into individual entities or quoted phrases
    const entities = keywords.match(/("[^"]+"|\S+)/g) || [];
    let score = 0;
    
    for (const entity of entities) {
      const cleanEntity = entity.replace(/"/g, '');
      // Strict case-insensitive whole-word boundary matching on TITLE only
      const regex = new RegExp(`\\b${cleanEntity}\\b`, 'i');
      if (regex.test(titleText)) {
        score += 2; // Match of a specific entity (e.g. "HDFC") is high confidence
      }
    }
    if (score >= 2) sectorScores[sector] = score;
  }
  
  // Return the sector with the single highest confidence score
  const sorted = Object.entries(sectorScores).sort((a, b) => b[1] - a[1]);
  return sorted.length > 0 ? sorted[0][0] : 'general';
}

// =====================================================
// Mock data fallback (when no GNews key)
// =====================================================
function getMockArticles() {
  return [
    // --- BANKING (8) ---
    { id: 'm_b1', title: 'RBI Holds Repo Rates Steady at 6.5%, Signals Cautious Growth', source: 'ET Markets', content: 'The Reserve Bank of India keeps interest rates unchanged for the 8th consecutive time.', sector: 'banking', url: 'https://et.com/b1', image: 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=400' },
    { id: 'm_b2', title: 'HDFC Bank Q3 Net Profit Surges 33% to ₹16,373 Crore', source: 'ET Now', content: 'India\'s largest private lender beats analyst estimates significantly.', sector: 'banking', url: 'https://et.com/b2', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400' },
    { id: 'm_b3', title: 'SBI to Raise ₹10,000 Crore via Infrastructure Bonds', source: 'ET Markets', content: 'State Bank of India moves to lock in long-term capital for credit growth.', sector: 'banking', url: 'https://et.com/b3', image: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=400' },
    { id: 'm_b4', title: 'ICICI Bank Launches New AI-Powered Wealth Management Suite', source: 'ET BFSI', content: 'Personalized investment advice now available for high net worth clients.', sector: 'banking', url: 'https://et.com/b4', image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400' },
    { id: 'm_b5', title: 'Axis Bank Partners with Mastercard for Corporate Credit Solutions', source: 'ET Now', content: 'New collaboration aims to streamline B2B payment workflows.', sector: 'banking', url: 'https://et.com/b5', image: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=400' },
    { id: 'm_b6', title: 'Kotak Mahindra Bank Board Appoints New CEO After RBI Nod', source: 'ET Markets', content: 'Leadership transition stabilizes investor sentiment.', sector: 'banking', url: 'https://et.com/b6', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400' },
    { id: 'm_b7', title: 'Fintech Disruption: How Neobanks are Challenging Traditional PSUs', source: 'ET BFSI', content: 'Digital-first approaches gain market share among young professionals.', sector: 'banking', url: 'https://et.com/b7', image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400' },
    { id: 'm_b8', title: 'PNB Reports Highest Ever Quarterly Profit in Q3FY26', source: 'ET Now', content: 'Sharp reduction in NPAs drives bottom-line growth.', sector: 'banking', url: 'https://et.com/b8', image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400' },

    // --- IT & TECH (8) ---
    { id: 'm_i1', title: 'Infosys Wins $2 Billion Digital Transformation Deal in Europe', source: 'ET Tech', content: 'Multi-year contract focuses on cloud and AI infrastructure.', sector: 'it', url: 'https://et.com/i1', image: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400' },
    { id: 'm_i2', title: 'TCS Announces Record ₹75 Special Dividend for Shareholders', source: 'ET Markets', content: 'India\'s IT giant returns excess cash after strong quarterly performance.', sector: 'it', url: 'https://et.com/i2', image: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400' },
    { id: 'm_i3', title: 'Wipro to Invest $1 Billion in AI Development Over 3 Years', source: 'ET Tech', content: 'Strategic pivot towards generative AI solutions for global clients.', sector: 'it', url: 'https://et.com/i3', image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400' },
    { id: 'm_i4', title: 'HCL Tech Launches GenAI Foundry to Accelerate Enterprise Adoption', source: 'ET Tech', content: 'New lab aims to build industry-specific large language models.', sector: 'it', url: 'https://et.com/i4', image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400' },
    { id: 'm_i5', title: 'Global Tech Layoffs: Impact on Indian IT Hubs Evaluated', source: 'ET Tech', content: 'Bangalore and Hyderabad see shift towards specialized AI roles.', sector: 'it', url: 'https://et.com/i5', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400' },
    { id: 'm_i6', title: 'LTIMindtree Secures High-Tech Manufacturing Contract', source: 'ET Markets', content: 'Expands presence in the semiconductor vertical.', sector: 'it', url: 'https://et.com/i6', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400' },
    { id: 'm_i7', title: 'Tech Mahindra Focuses on 5G Solutions in Middle East Expansion', source: 'ET Now', content: 'New regional headquarters established in Riyadh.', sector: 'it', url: 'https://et.com/i7', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400' },
    { id: 'm_i8', title: 'Cognizant Boosts Campus Hiring for 2026 Batch', source: 'ET Tech', content: 'Demand for full-stack developers remains resilient.', sector: 'it', url: 'https://et.com/i8', image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400' },

    // --- PHARMA & HEALTH (6) ---
    { id: 'm_p1', title: 'Sun Pharma Gets USFDA Nod for Generic Oncology Drug', source: 'ET Pharma', content: 'Approval opens up $400 million market opportunity in the US.', sector: 'pharma', url: 'https://et.com/p1', image: 'https://images.unsplash.com/photo-1587854680352-936b22b91030?w=400' },
    { id: 'm_p2', title: 'Dr. Reddy\'s Launches Generic version of Diabetes Medication', source: 'ET Pharma', content: 'Affordable treatment option now available in Indian markets.', sector: 'pharma', url: 'https://et.com/p2', image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400' },
    { id: 'm_p3', title: 'Cipla to Expand Manufacturing in South Africa', source: 'ET Now', content: 'Focus on respiratory and anti-retroviral therapies.', sector: 'pharma', url: 'https://et.com/p3', image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400' },
    { id: 'm_p4', title: 'Lupin Clears USFDA Inspection at Pithampur Facility', source: 'ET Markets', content: 'VAI status assigned, paving way for new product launches.', sector: 'pharma', url: 'https://et.com/p4', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400' },
    { id: 'm_p5', title: 'Zydus Life Receives Approval for Liver Disease Therapeutic', source: 'ET Pharma', content: 'First indigenous drug for NASH available for clinical use.', sector: 'pharma', url: 'https://et.com/p5', image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400' },
    { id: 'm_p6', title: 'Aurobindo Pharma Reports Strong Growth in European Markets', source: 'ET Markets', content: 'Revenue from injectable portfolio drives margin improvement.', sector: 'pharma', url: 'https://et.com/p6', image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400' },

    // --- AUTO (6) ---
    { id: 'm_a1', title: 'Tata Motors to De-merge Commercial and Passenger Vehicle Units', source: 'ET Markets', content: 'Strategic move to unlock value for shareholders.', sector: 'auto', url: 'https://et.com/a1', image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400' },
    { id: 'm_a2', title: 'Mahindra Unveils 5 New Global Electric SUVs', source: 'ET Now', content: 'Aggressive push into the EV segment with "Born Electric" platform.', sector: 'auto', url: 'https://et.com/a2', image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400' },
    { id: 'm_a3', title: 'Maruti Suzuki Hybrid Sales Outpace Conventional Petrol Models', source: 'ET Markets', content: 'Consumer preference shifts towards fuel efficiency in SUVs.', sector: 'auto', url: 'https://et.com/a3', image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=400' },
    { id: 'm_a4', title: 'Hero MotoCorp Ramps Up EV Production Facility', source: 'ET Now', content: 'Vida brand to expand to 100+ cities by end of year.', sector: 'auto', url: 'https://et.com/a4', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400' },
    { id: 'm_a5', title: 'Bajaj Auto to Launch First CNG-Powered Motorcycle', source: 'ET Auto', content: 'Innovation targeting the cost-conscious commuter segment.', sector: 'auto', url: 'https://et.com/a5', image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400' },
    { id: 'm_a6', title: 'TVS Motor Expands Footprint in Southeast Asia', source: 'ET Markets', content: 'Partnership with local distributors for entry into Vietnam.', sector: 'auto', url: 'https://et.com/a6', image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400' },

    // --- FMCG (8) ---
    { id: 'm_f1', title: 'ITC Demerger: FMCG Business to List Separately by Q4FY26', source: 'ET Markets', content: 'ITC completes long-awaited demerger of its fast-moving consumer goods vertical.', sector: 'fmcg', url: 'https://et.com/f1', image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400' },
    { id: 'm_f2', title: 'Nestle India Reports Double-Digit Revenue Growth in Q3', source: 'ET Now', content: 'Maggi maker beats street estimates on rural demand recovery.', sector: 'fmcg', url: 'https://et.com/f2', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400' },
    { id: 'm_f3', title: 'Dabur Launches New Ayurvedic Immunity Range for Winter', source: 'ET Retail', content: 'Expanding natural health portfolio with 12 new SKUs.', sector: 'fmcg', url: 'https://et.com/f3', image: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=400' },
    { id: 'm_f4', title: 'Unilever Plans ₹2,000 Crore Investment in India Manufacturing', source: 'ET Now', content: 'New greenfield facility to cater to growing premium segment.', sector: 'fmcg', url: 'https://et.com/f4', image: 'https://images.unsplash.com/photo-1581578017093-cd30ed93dd39?w=400' },
    { id: 'm_f5', title: 'Britannia Enters Dairy Market with Premium Cheese Portfolio', source: 'ET Retail', content: 'Challenging Amul dominance with imported cheese variants.', sector: 'fmcg', url: 'https://et.com/f5', image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400' },
    { id: 'm_f6', title: 'ITC Foods Acquires D2C Snack Brand for ₹500 Crore', source: 'ET Markets', content: 'Building inorganic growth pipeline in health-food category.', sector: 'fmcg', url: 'https://et.com/f6', image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400' },
    { id: 'm_f7', title: 'Nestle Challenges Regulator on Front-of-Pack Labelling Norms', source: 'ET FMCG', content: 'Industry body seeks phased implementation of FSSAI guidelines.', sector: 'fmcg', url: 'https://et.com/f7', image: 'https://images.unsplash.com/photo-1573461160327-b450ce3d8e7f?w=400' },
    { id: 'm_f8', title: 'Dabur Q3 Results: Rural Recovery Lifts FMCG Margins to 21%', source: 'ET Markets', content: 'Volume growth outpaces value growth for third straight quarter.', sector: 'fmcg', url: 'https://et.com/f8', image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400' },

    // --- REAL ESTATE (8) ---
    { id: 'm_r1', title: 'DLF Launches Ultra-Luxury Project in Gurugram, Prices Start at ₹7 Cr', source: 'ET Realty', content: 'New project targets HNI buyers in Golf Course Extension Road.', sector: 'realestate', url: 'https://et.com/r1', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400' },
    { id: 'm_r2', title: 'Godrej Properties Reports Record Booking Value of ₹17,500 Crore', source: 'ET Markets', content: 'Strong demand across Mumbai, Pune, and Bangalore projects.', sector: 'realestate', url: 'https://et.com/r2', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400' },
    { id: 'm_r3', title: 'Oberoi Realty Wins New Land Parcel in Mumbai for ₹1,800 Crore', source: 'ET Now', content: 'Prime Worli location to house ultra-premium residential towers.', sector: 'realestate', url: 'https://et.com/r3', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400' },
    { id: 'm_r4', title: 'Macrotech Developers Expands into Hyderabad with ₹3,000 Cr Project', source: 'ET Realty', content: 'Lodha brand enters South India market for the first time.', sector: 'realestate', url: 'https://et.com/r4', image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400' },
    { id: 'm_r5', title: 'DLF Commercial Arm Leases 2 Million Sq Ft in Cyber City', source: 'ET Markets', content: 'Major IT companies anchor new Grade A office space in Gurgaon.', sector: 'realestate', url: 'https://et.com/r5', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400' },
    { id: 'm_r6', title: 'Godrej Properties Q3 Net Profit Surges 45% on Strong Pre-Sales', source: 'ET Now', content: 'Premium pricing and faster execution drive margin expansion.', sector: 'realestate', url: 'https://et.com/r6', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400' },
    { id: 'm_r7', title: 'Oberoi Realty and Government Partner on Mumbai Slum Redevelopment', source: 'ET Realty', content: 'Joint venture targets 5,000 affordable housing units in Goregaon.', sector: 'realestate', url: 'https://et.com/r7', image: 'https://images.unsplash.com/photo-1448630360428-65456885c650?w=400' },
    { id: 'm_r8', title: 'DLF Rental Income Crosses ₹6,000 Crore Annual Run Rate', source: 'ET Markets', content: 'Growing annuity business provides stability amid cycle fluctuations.', sector: 'realestate', url: 'https://et.com/r8', image: 'https://images.unsplash.com/photo-1464938050520-ef2571e0d6e0?w=400' },

    // --- MARKETS & FINANCE (6) ---
    { id: 'm_m1', title: 'Sensex Reaches Historic High of 75,000 Amid Global Rally', source: 'ET Markets', content: 'Strong FII inflows and positive earnings drive bull run.', sector: 'markets', url: 'https://et.com/m1', image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400' },
    { id: 'm_m2', title: 'Gold Prices Hit Record Highs as Geopolitical Tensions Rise', source: 'ET Markets', content: 'Safe-haven demand pushes yellow metal to new peaks.', sector: 'markets', url: 'https://et.com/m2', image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400' },
    { id: 'm_m3', title: 'SEBI Proposes New Disclosure Norms for F&O Traders', source: 'ET Markets', content: 'Aims to increase transparency and reduce retail investor risk.', sector: 'markets', url: 'https://et.com/m3', image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400' },
    { id: 'm_m4', title: 'Indian Rupee Stabilizes Against Dollar Following RBI Intervention', source: 'ET Markets', content: 'Central bank manages volatility amid fluctuating oil prices.', sector: 'markets', url: 'https://et.com/m4', image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400' },
    { id: 'm_m5', title: 'Nifty IT Index Outperforms Benchmarks on Strong Deal Pipeline', source: 'ET Markets', content: 'Investors rotate back into growth stocks.', sector: 'markets', url: 'https://et.com/m5', image: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=400' },
    { id: 'm_m6', title: 'Corporate Bond Issuance Surges in H1FY26', source: 'ET Markets', content: 'Companies lock in rates before expected global tightening.', sector: 'markets', url: 'https://et.com/m6', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400' },
  ];
}

// =====================================================
// CORE: Fetch from GNews API
// =====================================================

/**
 * Search GNews for a specific query string.
 * @param {string} query - Search keywords
 * @param {number} max - Max articles (1-10)
 * @returns {Promise<Array>} Normalized article objects
 */
async function fetchFromGNews(query, max = 10) {
  if (!GNEWS_API_KEY) {
    console.warn('⚠️ No GNEWS_API_KEY set, searching mock database for:', query);
    const mockDb = getMockArticles();
    const queryLower = query.toLowerCase();
    
    // 1. Try exact ID lookup first
    const byId = mockDb.find(a => a.id === query);
    if (byId) return [byId];

    // 2. Try exact SECTOR match (high priority for "it", "auto", etc.)
    const bySector = mockDb.filter(a => a.sector.toLowerCase() === queryLower);
    if (bySector.length > 0) return bySector.slice(0, max);

    // 3. Perform PRECISE keyword search (using word boundaries)
    const regex = new RegExp(`\\b${queryLower}\\b`, 'i');
    const results = mockDb.filter(a => 
      regex.test(a.title) || 
      (a.content && regex.test(a.content))
    );

    return results.length > 0 ? results.slice(0, max) : [];
  }

  const cacheKey = `gnews:${query}:${max}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  // Augment short sector queries to prevent substring matches (e.g., "it" matching "Profit")
  let augmentedQuery = query;
  const qLower = query.toLowerCase();
  if (qLower === 'it') augmentedQuery = 'IT technology Infosys TCS India';
  else if (qLower === 'auto') augmentedQuery = 'automobile EV India';
  else if (qLower === 'pharma') augmentedQuery = 'pharmaceutical healthcare India';
  else if (qLower === 'banking') augmentedQuery = 'banking finance RBI India';

  const searchQuery = augmentedQuery.trim();

  try {
    console.log(`📡 GNews Search: "${searchQuery}" (Original: "${query}")`);
    const response = await axios.get(`${GNEWS_BASE}/search`, {
      params: {
        q: searchQuery,
        lang: 'en',
        country: 'in',
        max,
        apikey: GNEWS_API_KEY,
      },
      timeout: 8000,
    });

    const articles = (response.data.articles || []).map((a, idx) => ({
      id: `gnews_${Date.now()}_${idx}`,
      title: a.title,
      source: a.source?.name || 'News',
      content: a.description || a.content || '',
      fullContent: a.content || a.description || '',
      url: a.url,
      image: a.image || `https://images.unsplash.com/photo-1611974714405-1a8b13c1935e?auto=format&fit=crop&q=80&w=400`,
      publishedAt: a.publishedAt,
      sector: detectSector(a.title, a.description),
    }));

    setCache(cacheKey, articles);
    console.log(`✅ GNews returned ${articles.length} articles for "${query}"`);
    return articles;
  } catch (error) {
    console.error(`❌ GNews API Error for "${query}":`, error.message);
    const queryLower = query.toLowerCase();
    return getMockArticles().filter(a => 
      a.title.toLowerCase().includes(queryLower) || 
      a.sector.toLowerCase().includes(queryLower)
    ).slice(0, max);
  }
}

/**
 * Fetch GNews top headlines by category.
 * @param {string} category - business, technology, health, science, sports, entertainment, general, world, nation
 * @param {number} max
 */
async function fetchTopHeadlines(category = 'business', max = 10) {
  if (!GNEWS_API_KEY) return getMockArticles();

  const cacheKey = `gnews_headlines:${category}:${max}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    console.log(`📡 GNews Headlines: category="${category}" (max: ${max})`);
    const response = await axios.get(`${GNEWS_BASE}/top-headlines`, {
      params: {
        category,
        lang: 'en',
        country: 'in',
        max,
        apikey: GNEWS_API_KEY,
      },
      timeout: 8000,
    });

    const articles = (response.data.articles || []).map((a, idx) => ({
      id: `gnews_hl_${Date.now()}_${idx}`,
      title: a.title,
      source: a.source?.name || 'News',
      content: a.description || a.content || '',
      fullContent: a.content || a.description || '',
      url: a.url,
      image: a.image || `https://images.unsplash.com/photo-1611974714405-1a8b13c1935e?auto=format&fit=crop&q=80&w=400`,
      publishedAt: a.publishedAt,
      sector: detectSector(a.title, a.description),
    }));

    setCache(cacheKey, articles);
    console.log(`✅ GNews headlines returned ${articles.length} for "${category}"`);
    return articles;
  } catch (error) {
    console.error(`❌ GNews Headlines Error:`, error.message);
    return getMockArticles();
  }
}

// =====================================================
// Sector → GNews category mapping
// =====================================================
const SECTOR_TO_GNEWS_CATEGORY = {
  banking: 'business',
  it: 'technology',
  pharma: 'health',
  auto: 'business',
  fmcg: 'business',
  energy: 'business',
  realestate: 'business',
  metals: 'business',
  markets: 'business',
};

// =====================================================
// PUBLIC API: fetchArticles (general trending)
// =====================================================
async function fetchArticles(topic = 'Indian finance business') {
  return fetchFromGNews(topic, 10);
}

// =====================================================
// PUBLIC API: fetchArticlesByProfile (sector-aware)
// =====================================================
async function fetchArticlesByProfile(sectors = [], interests = [], extraTopic = '', language = 'English', userType = 'investor') {
  // --- Handle specific article analysis (single article deep dive) ---
  if (extraTopic) {
    // For briefing: search GNews for the specific headline/topic
    const results = await fetchFromGNews(extraTopic, 5);

    if (results.length > 0) {
      // PROACTIVE: Reconstruct the full article content using AI
      const topArticle = results[0];
      console.log(`🪄 Reconstructing live article: "${topArticle.title}"`);

      const fullContent = await GeminiService.reconstructArticle(
        topArticle.title,
        topArticle.content,
        language,
        userType
      );

      return [{
        ...topArticle,
        fullContent: fullContent,
        content: fullContent // ensure consistent display
      }];
    }

    // 3. Fallback to mock if search returns nothing
    const fallback = getMockArticles().filter(a =>
      a.title?.toLowerCase().includes(extraTopic.toLowerCase()) ||
      a.sector?.toLowerCase() === extraTopic.toLowerCase()
    );

    // CRITICAL: Always return here to prevent falling through to generic profile sectors
    return fallback.length > 0 ? fallback : [];
  }

  // --- Sector-based feed (home page tabs / Your Interests) ---
  if (sectors.length > 0) {
    // Fetch 5 articles per sector (to ensure at least 3 after dedup)
    const sectorEntries = sectors
      .map(s => ({ sector: s.toLowerCase(), keywords: SECTOR_KEYWORDS[s.toLowerCase()] }))
      .filter(entry => entry.keywords);

    if (sectorEntries.length > 0) {
      const promises = sectorEntries.map(entry =>
        fetchFromGNews(entry.keywords, 15).then(articles =>
          articles.map(a => ({ ...a, sector: entry.sector }))
        )
      );
      const results = await Promise.all(promises);
 
      // Individual Sector Bucketing to guarantee 3 each
      let allArticles = [];
      const globalSeen = new Set();

      for (let i = 0; i < sectorEntries.length; i++) {
        const sector = sectorEntries[i].sector;
        let sectorArticles = results[i].filter(a => {
           if (globalSeen.has(a.url)) return false;
           // ONLY keep if it matches the sector strictly
           const detected = detectSector(a.title, a.content || '');
           return detected === sector;
        });

        // FORCE-ADD MOCKS if API is thin (ignoring global duplicate check to ensure volume)
        if (sectorArticles.length < 3) {
           const mocks = getMockArticles().filter(m => m.sector === sector);
           for (const m of mocks) {
              if (sectorArticles.length >= 3) break;
              sectorArticles.push({ ...m, id: `${m.id}_${Date.now()}` });
           }
        }
        
        // Finalize 3 for this sector
        const finalSection = sectorArticles.slice(0, 3);
        finalSection.forEach(a => globalSeen.add(a.url));
        allArticles = allArticles.concat(finalSection);
        console.log(`[TRACE] Sector "${sector}": ${finalSection.length} articles delivered`);
      }
 
      // Trace log breakdown per sector
      const sectorCounts = {};
      allArticles.forEach(a => { sectorCounts[a.sector] = (sectorCounts[a.sector] || 0) + 1; });
      const breakdown = Object.entries(sectorCounts).map(([s, c]) => `${c} ${s.charAt(0).toUpperCase() + s.slice(1)}`).join(', ');
      console.log(`[TRACE] Delivering ${allArticles.length} articles (${breakdown})`);
      return allArticles;
    }
  }

  // --- Interest-based enrichment ---
  if (interests.length > 0) {
    const interestQueries = interests
      .map(i => INTEREST_KEYWORDS[i] || i) // Use keyword map or literal interest
      .filter(Boolean);

    if (interestQueries.length > 0) {
      // Fetch 5 articles for EACH interest to ensure variety
      const promises = interestQueries.map(q => fetchFromGNews(q, 5));
      const results = await Promise.all(promises);
      const allArticles = results.flat();

      const seen = new Set();
      const unique = allArticles.filter(a => {
        if (seen.has(a.url)) return false;
        seen.add(a.url);
        return true;
      });

      // Filter out mock data if we have real results
      const realResults = unique.filter(a => a.id && String(a.id).startsWith('gnews'));
      return realResults.length > 0 ? realResults : unique;
    }
  }

  // --- Default: top business headlines ---
  return fetchTopHeadlines('business', 10);
}

// =====================================================
// PUBLIC API: fetchArticlesBySector (for individual sector tab)
// =====================================================
async function fetchArticlesBySector(sector) {
  const sectorLower = sector.toLowerCase();
  const keywords = SECTOR_KEYWORDS[sectorLower];
  const category = SECTOR_TO_GNEWS_CATEGORY[sectorLower] || 'business';

  // INCREASED VOLUME: Fetch 20 raw items to ensure 15+ after strict filtering
  const [searchResults, headlineResults] = await Promise.all([
    keywords ? fetchFromGNews(keywords, 15) : Promise.resolve([]),
    fetchTopHeadlines(category, 15)
  ]);

  // Total Combined
  const allResults = [...searchResults, ...headlineResults];

  // STRICT DOMAIN ISOLATION: Only keep articles that strictly belong to the sector
  const seen = new Set();
  const filtered = allResults.filter(a => {
    if (seen.has(a.url)) return false;
    
    const detected = detectSector(a.title, a.content || '');
    if (detected !== sectorLower) return false;

    seen.add(a.url);
    return true;
  });

  // GUARANTEED 15+ ARTICLES: backfill using expanded mock database if needed
  if (filtered.length < 15) {
    const mocks = getMockArticles().filter(m => m.sector === sectorLower);
    for (const m of mocks) {
      if (filtered.length >= 20) break; // target 20 for scrolling depth
      if (!seen.has(m.url || m.id)) {
        seen.add(m.url || m.id);
        filtered.push({ ...m, id: `${m.id}_${Date.now()}` });
      }
    }
  }

  console.log(`📊 Sector Pill "${sector}": Returning ${filtered.length} STRICT articles (Isolation Mode)`);
  return filtered;
}

module.exports = {
  fetchArticles,
  fetchArticlesByProfile,
  fetchArticlesBySector,
  SECTOR_KEYWORDS,
};
