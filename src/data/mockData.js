export const sectors = [
  { id: 'banking', name: 'Banking', color: '#1A1A2E', gradient: 'linear-gradient(135deg, #111111, #1a1a2e)' },
  { id: 'it', name: 'IT', color: '#374151', gradient: 'linear-gradient(135deg, #1a1a2e, #374151)' },
  { id: 'pharma', name: 'Pharma', color: '#E53935', gradient: 'linear-gradient(135deg, #b71c1c, #e53935)' },
  { id: 'auto', name: 'Auto', color: '#E53935', gradient: 'linear-gradient(135deg, #b71c1c, #e53935)' },
  { id: 'fmcg', name: 'FMCG', color: '#f59e0b', gradient: 'linear-gradient(135deg, #d97706, #f59e0b)' },
  { id: 'energy', name: 'Energy', color: '#374151', gradient: 'linear-gradient(135deg, #1a1a2e, #374151)' },
  { id: 'realestate', name: 'Real Estate', color: '#1A1A2E', gradient: 'linear-gradient(135deg, #111111, #1a1a2e)' },
  { id: 'metals', name: 'Metals', color: '#4b5563', gradient: 'linear-gradient(135deg, #374151, #4b5563)' },
];

export const investorTypes = [
  {
    id: 'longterm',
    title: 'Long-term Investor',
    description: 'I invest for 2+ years, focused on fundamentals and growth.',
    icon: 'TrendingUp',
    color: '#10B981',
  },
  {
    id: 'shortterm',
    title: 'Short-term Trader',
    description: 'I hold for weeks to months, riding momentum and events.',
    icon: 'BarChart3',
    color: '#F97316',
  },
  {
    id: 'trader',
    title: 'Day Trader',
    description: 'I trade daily, focused on price action and technical analysis.',
    icon: 'Zap',
    color: '#EF4444',
  },
];

export const userTypes = [
  { id: 'investor', label: 'Retail Investor', sub: 'I invest in stocks, MFs or ETFs', icon: '📈', value: 'investor' },
  { id: 'student', label: 'Student', sub: 'Commerce, MBA, economics or self-learning', icon: '🎓', value: 'student' },
  { id: 'founder', label: 'Startup Founder', sub: 'Building or working at a startup', icon: '🚀', value: 'founder' },
  { id: 'professional', label: 'Finance Professional', sub: 'Banking, consulting, research or advisory', icon: '💼', value: 'professional' },
  { id: 'business_owner', label: 'Business Owner', sub: 'Running a business or professional practice', icon: '🏢', value: 'business_owner' },
  { id: 'reader', label: 'Just Curious', sub: 'I follow news for general awareness', icon: '🔍', value: 'reader' },
];

export const studentGoalsByStream = {
  ca: [
    { id: 'exams', label: 'Crack CA/CMA exams', sub: 'Focused on professional certification' },
    { id: 'concepts', label: 'Master accounting & taxation', sub: 'Deep dive into technical principles' },
    { id: 'updates', label: 'Track corporate & regulatory updates', sub: 'Stay current with law changes' },
    { id: 'statements', label: 'Understand financial statements', sub: 'Practical analysis of reports' },
  ],
  mba: [
    { id: 'roles', label: 'Prepare for finance roles', sub: 'IB, consulting, and corporate finance' },
    { id: 'strategies', label: 'Understand markets & investments', sub: 'Investment logic and asset classes' },
    { id: 'news', label: 'Track business news & deals', sub: 'M&A, funding, and corporate moves' },
    { id: 'cases', label: 'Build case-study thinking', sub: 'Analytical approach to business' },
  ],
  economics: [
    { id: 'exams', label: 'Crack UPSC / govt exams', sub: 'Current affairs for competitive tests' },
    { id: 'macro', label: 'Understand macroeconomics', sub: 'Policy, indicators, and global trends' },
    { id: 'govt', label: 'Track budget & govt decisions', sub: 'Fiscal policy and sovereign moves' },
    { id: 'writing', label: 'Build analytical skills', sub: 'Synthesizing complex info for answers' },
  ],
  engineering: [
    { id: 'placements', label: 'Prepare for tech placements', sub: 'Business context for tech roles' },
    { id: 'trends', label: 'Learn AI/ML & tech trends', sub: 'Future of tech and markets' },
    { id: 'startup', label: 'Track startup ecosystem', sub: 'Innovation, VC, and new tech biz' },
    { id: 'solving', label: 'Build problem-solving mindset', sub: 'Applying logic to market data' },
  ],
  other: [
    { id: 'career', label: 'Explore different career paths', sub: 'General exposure to finance' },
    { id: 'basics', label: 'Learn basics of business', sub: 'Foundational knowledge' },
    { id: 'trending', label: 'Stay updated with trends', sub: 'What everyone is talking about' },
    { id: 'awareness', label: 'Build general awareness', sub: 'Stay informed for daily life' },
  ],
};

export const studentQuestions = [
  {
    id: 'study_stream',
    title: "What are you studying?",
    subtitle: "We'll tailor explainers to your field",
    type: 'single',
    options: [
      { id: 'ca', label: 'Commerce / CA / CMA', sub: 'Accountancy, taxation, auditing' },
      { id: 'mba', label: 'MBA / Finance', sub: 'Business, investment, strategy' },
      { id: 'economics', label: 'Economics / UPSC', sub: 'Macro, policy, governance' },
      { id: 'engineering', label: 'Engineering / Tech', sub: 'Following markets as a side interest' },
      { id: 'other', label: 'Other / Self-learning', sub: 'No formal course, learning independently' },
    ],
  },
  {
    id: 'study_goal',
    title: "What's your main goal?",
    subtitle: "This shapes how we explain the news",
    type: 'single',
    options: [], // Dynamically populated
  },
];

export const founderQuestions = [
  {
    id: 'startup_stage',
    title: "What stage is your startup?",
    subtitle: "We'll match news to your growth phase",
    type: 'single',
    options: [
      { id: 'idea', label: 'Idea / Pre-revenue', sub: 'Just starting out, building the product' },
      { id: 'early', label: 'Early stage (0-2 years)', sub: 'Some revenue, finding product-market fit' },
      { id: 'growth', label: 'Growth stage', sub: 'Scaling, hiring, raising funding' },
      { id: 'employee', label: 'I work at a startup', sub: 'Employee, not founder' },
    ],
  },
  {
    id: 'startup_sector',
    title: "What's your startup's space?",
    subtitle: "Select all that apply",
    type: 'multi',
    options: [
      { id: 'Fintech', label: 'Fintech' },
      { id: 'Healthtech', label: 'Healthtech' },
      { id: 'Edtech', label: 'Edtech' },
      { id: 'SaaS', label: 'SaaS / B2B' },
      { id: 'D2C', label: 'D2C / Consumer' },
      { id: 'Deeptech', label: 'Deeptech' },
      { id: 'Agritech', label: 'Agritech' },
      { id: 'Logistics', label: 'Logistics' },
      { id: 'Climate', label: 'Climate' },
      { id: 'Other', label: 'Other' },
    ],
  },
  {
    id: 'news_priority',
    title: "What news matters most to you?",
    subtitle: "We'll prioritise these stories",
    type: 'single',
    options: [
      { id: 'funding', label: 'Funding rounds and VC activity', sub: 'Who\'s raising, valuations, investor sentiment' },
      { id: 'regulation', label: 'Regulation and policy', sub: 'GST, RBI, SEBI, sector-specific rules' },
      { id: 'talent', label: 'Talent and hiring market', sub: 'Layoffs, hiring trends, salary benchmarks' },
      { id: 'competition', label: 'Competitor and market moves', sub: 'What others in my space are doing' },
    ],
  },
];

export const professionalQuestions = [
  {
    id: 'job_function',
    title: "What's your role?",
    subtitle: "We'll match the depth to your expertise",
    type: 'single',
    options: [
      { id: 'investment', label: 'Investment / Fund Management', sub: 'Portfolio manager, analyst, trader' },
      { id: 'banking', label: 'Banking / Lending', sub: 'Corporate banking, retail, treasury' },
      { id: 'consulting', label: 'Consulting / Advisory', sub: 'Strategy, finance, tax advisory' },
      { id: 'accounting', label: 'Accounting / Compliance', sub: 'CA, CFO, audit, taxation' },
      { id: 'research', label: 'Research / Journalism', sub: 'Equity research, financial journalism' },
    ],
  },
  {
    id: 'seniority',
    title: "What level are you?",
    subtitle: "This sets the analysis depth",
    type: 'single',
    options: [
      { id: 'junior', label: 'Junior / Analyst level', sub: '0-3 years experience' },
      { id: 'mid', label: 'Mid-level / Manager', sub: '4-10 years experience' },
      { id: 'senior', label: 'Senior / Leadership', sub: '10+ years, strategic decisions' },
    ],
  },
];

export const businessOwnerQuestions = [
  {
    id: 'business_type',
    title: "What kind of business do you run?",
    subtitle: "We'll surface news that affects your sector",
    type: 'single',
    options: [
      { id: 'manufacturing', label: 'Manufacturing or Production', sub: '' },
      { id: 'retail', label: 'Retail or Trading', sub: '' },
      { id: 'export', label: 'Import / Export', sub: '' },
      { id: 'realestate', label: 'Real Estate or Construction', sub: '' },
      { id: 'services', label: 'Services (restaurant, salon, etc)', sub: '' },
      { id: 'practice', label: 'Professional practice (doctor, lawyer)', sub: '' },
    ],
  },
  {
    id: 'business_challenges',
    title: "What business challenges matter to you?",
    subtitle: "Select all that apply",
    type: 'multi',
    options: [
      { id: 'GST & Taxation', label: 'GST & Taxation' },
      { id: 'Input costs & inflation', label: 'Input costs & inflation' },
      { id: 'Bank loans & rates', label: 'Bank loans & rates' },
      { id: 'Govt tenders & contracts', label: 'Govt tenders & contracts' },
      { id: 'Labour & hiring', label: 'Labour & hiring' },
      { id: 'Import duties & forex', label: 'Import duties & forex' },
      { id: 'Competition', label: 'Competition' },
      { id: 'Regulatory compliance', label: 'Regulatory compliance' },
    ],
  },
];

export const readerQuestions = [
  {
    id: 'reading_reason',
    title: "Why do you follow business news?",
    subtitle: "Select all that apply",
    type: 'multi',
    options: [
      { id: 'informed', label: 'Stay informed about the economy' },
      { id: 'daily_life', label: 'Understand what affects my daily life' },
      { id: 'social', label: 'Keep up with what people are talking about' },
      { id: 'retired', label: "I'm retired and follow out of habit" },
    ],
  },
];

// Personalised interest options based on user type
export function getInterestOptions(userType) {
  const common = ['Daily market digest', 'Breaking news alerts', 'Weekend wrap-ups'];
  const typeSpecific = {
    investor: ['Portfolio watchlist alerts', 'Earnings calendar & results', 'Stock price targets', 'Mutual fund picks', 'Dividend announcements', 'Sector rotation analysis'],
    student: ['Concept explainers', 'Exam-relevant current affairs', 'Market basics simplified', 'Industry case studies', 'Economic indicators decoded', 'Career & placement news'],
    founder: ['Funding round tracker', 'Startup policy & compliance', 'Competitor landscape updates', 'Talent market insights', 'Investor sentiment tracker', 'Sector disruption reports'],
    professional: ['Institutional flow data', 'Regulatory & compliance updates', 'M&A deal tracker', 'Credit market analysis', 'Global macro dashboard', 'Quarterly earnings deep-dives'],
    business_owner: ['GST & tax updates', 'Interest rate impact reports', 'Input cost tracker', 'Government tender alerts', 'MSME policy changes', 'Supply chain insights'],
    reader: ['Simple market summaries', 'How it affects daily life', 'Trending business stories', 'Personal finance tips', 'Economy in plain English', 'Money-saving insights'],
  };
  return [...(typeSpecific[userType] || typeSpecific.reader), ...common];
}

export const languageOptions = [
  { id: 'en', label: 'English', sub: 'Default' },
  { id: 'hi', label: 'Hindi', sub: 'हिंदी' },
  { id: 'ta', label: 'Tamil', sub: 'தமிழ்' },
  { id: 'te', label: 'Telugu', sub: 'తెలుగు' },
  { id: 'bn', label: 'Bengali', sub: 'বাংলা' },
  { id: 'mr', label: 'Marathi', sub: 'मराठी' },
];

export const mockArticles = [
  {
    id: 1,
    title: 'RBI Holds Rates Steady at 6.5%, Signals Cautious Optimism on Growth',
    summary: 'The Reserve Bank of India maintained its repo rate, citing sticky inflation and global uncertainty. Markets reacted positively.',
    source: 'ET Markets',
    time: '2h ago',
    sector: 'banking',
    cluster: 'Your Stocks',
    thumbnail: 'https://images.unsplash.com/photo-1611974714405-1a8b13c1935e?auto=format&fit=crop&q=80&w=400',
    fullContent: `
      Mumbai: The Reserve Bank of India’s (RBI) Monetary Policy Committee (MPC) on Friday decided to keep the repo rate unchanged at 6.5 per cent for the eighth consecutive time. 
      The decision was taken with a 4:2 majority. The MPC also decided to remain focused on the withdrawal of accommodation to ensure that inflation progressively aligns with the target, while supporting growth.
      
      RBI Governor Shaktikanta Das said the Indian economy has remained resilient in the face of global headwinds. 
      "The MPC noted that domestic economic activity remains resilient. Looking ahead, the forecast of above-normal southwest monsoon by the India Meteorological Department (IMD) is expected to boost kharif production and impart some downward pressure on food prices," Das said.
      
      He added that the global economy is showing signs of resilience but high debt levels and geopolitical tensions remain a concern. 
      "Inflation is continuing to moderate but the pace is slow. We must remain vigilant," the Governor noted.
      
      The repo rate is the interest rate at which the RBI lends money to commercial banks. 
      The decision to keep the rate unchanged means that home and auto loan EMIs are unlikely to increase in the near term.
    `,
    readTime: '4 min',
    isBreaking: true,
    pulseScore: 96,
    urgencyLevel: 'very_high',
    whyItMatters: 'Home loan rates stay flat for another quarter — fixed-income investors may want to lock in now.',
    tags: ['RBI', 'Interest Rates'],
  },
  {
    id: 2,
    title: 'HDFC Bank Q3 Results: Net Profit ₹16,736 Cr, Beats Street Estimates',
    summary: 'HDFC Bank reported strong quarterly numbers with NII growth of 24.5% YoY.',
    source: 'ET Now',
    time: '3h ago',
    sector: 'banking',
    cluster: 'Your Stocks',
    thumbnail: 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?auto=format&fit=crop&q=80&w=400',
    fullContent: `
      Mumbai: HDFC Bank delivered strong Q3FY26 results with net profit of Rs 16,736 crore, beating analyst estimates of Rs 16,200 crore and growing 21% year-on-year. 
      Net Interest Income grew 24.5% to Rs 29,610 crore. The bank maintained strong asset quality with Gross NPA at 1.26% and Net NPA at 0.35%. 
      
      Loan book growth came in at 16.2% YoY led by retail, commercial, and rural banking. MD Sashidhar Jagdishan guided for continued loan growth of 16-18% through FY27. The bank declared an interim dividend of Rs 19 per share.
    `,
    readTime: '5 min',
    isBreaking: false,
    pulseScore: 92,
    urgencyLevel: 'high',
    whyItMatters: 'HDFC Bank beats market estimates. This could trigger a re-rating for the entire private banking space.',
    tags: ['HDFC Bank', 'Results'],
  },
  {
    id: 3,
    title: 'Infosys Wins $2B Deal with European Telecom Giant, Stock Surges 4%',
    summary: 'Infosys announced its largest deal win this fiscal, lifting IT sector sentiment.',
    source: 'ET Tech',
    time: '4h ago',
    sector: 'it',
    cluster: 'IT & Tech',
    thumbnail: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&q=80&w=400',
    fullContent: `
      Bengaluru: Infosys announced its largest deal win in FY26, a $2 billion (approx Rs 16,700 crore) multi-year digital transformation contract with a major European telecom operator headquartered in Germany.
      
      The 7-year deal covers cloud migration to AWS and Azure, AI-driven network operations, and managed services for 42,000 employees. This takes Infosys total large deal wins to $4.8 billion in Q3 alone.
      
      Following the announcement, the company stock surged 4.2% intraday hitting a 52-week high of Rs 1,952. Analysts at Kotak upgraded the stock to Buy with a target of Rs 2,100, citing renewed momentum in European spending.
    `,
    readTime: '3 min',
    isBreaking: false,
    pulseScore: 88,
    urgencyLevel: 'high',
    whyItMatters: 'Large deal momentum in IT is back. This could lift TCS and Wipro sentiment in tomorrow\'s session.',
    tags: ['Infosys', 'IT Sector'],
  },
  {
    id: 4,
    title: 'TCS Announces Special Dividend of ₹75, Record Date Set for March 28',
    summary: 'TCS rewards shareholders with a special dividend; stock trades ex-dividend next week.',
    source: 'ET Markets',
    time: '5h ago',
    sector: 'it',
    cluster: 'IT & Tech',
    thumbnail: 'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?auto=format&fit=crop&q=80&w=400',
    fullContent: `
      Mumbai: Tata Consultancy Services announced a special dividend of Rs 75 per share on the back of stellar FY26 performance, marking the third consecutive year of special payouts.
      
      The record date is set for March 28 and the dividend will be paid by April 12. TCS total dividend outflow will be approximately Rs 27,400 crore — largely benefitting promoter Tata Sons who holds 72% stake.
      
      The IT bellwether also reported that its attrition rate has declined to 12.3%, the lowest since FY22. Analysts see the dividend as a strong signal about TCS cash generation capability amidst macro uncertainties.
    `,
    readTime: '2 min',
    isBreaking: false,
  },
  {
    id: 5,
    title: 'Sun Pharma Gets USFDA Approval for Generic Cancer Drug, Shares Rally',
    summary: 'The approval opens up a $500M market opportunity in the US.',
    source: 'ET Pharma',
    time: '6h ago',
    sector: 'pharma',
    cluster: 'Pharma & Health',
    thumbnail: 'https://images.unsplash.com/photo-1587854680352-936b22b91030?auto=format&fit=crop&q=80&w=400',
    fullContent: `
      Mumbai: Sun Pharmaceutical Industries received approval from India’s drug regulator DCGI for its first domestically developed specialty oncology molecule — a targeted therapy for HER2-positive breast cancer.
      
      The drug, branded as Sunherceptin, took 12 years and Rs 2,300 crore to develop. It will be priced at approximately one-third of its imported equivalent.
      
      Sun Pharma plans to scale production out of its Vadodara facility and is actively seeking WHO prequalification to enable exports to 72 low-and-middle-income countries. The development signals India’s growing ambition to move beyond generics into original drug discovery.
    `,
    readTime: '3 min',
    isBreaking: false,
  },
  {
    id: 6,
    title: 'Sensex Rallies 500 Points as FIIs Turn Net Buyers After 3 Weeks',
    summary: 'Foreign institutional investors bought ₹4,200 Cr in equities, boosting market sentiment.',
    source: 'ET Markets',
    time: '1h ago',
    sector: 'markets',
    cluster: 'Markets Today',
    thumbnail: 'https://images.unsplash.com/photo-1611974714405-1a8b13c1935e?auto=format&fit=crop&q=80&w=400',
    fullContent: `
      Mumbai: Foreign institutional investors bought Rs 4,200 crore worth of equities on Thursday — their heaviest single-day purchase in 3 weeks — pushing the Sensex past the 73,500 mark for the first time this month.
      
      Banking and IT stocks led the rally. HDFC Bank rose 2.4% and TCS gained 1.8%. The rupee also strengthened to 83.20 against the US dollar.
      
      Market breadth was strongly positive with 2,100 advances versus 780 declines. The uptick in FII activity signals renewed confidence in India’s macro stability following the RBI’s rate hold decision.
    `,
    readTime: '4 min',
    isBreaking: true,
  },
  {
    id: 7,
    title: 'Rupee Strengthens to 82.4 Against Dollar on Strong Capital Inflows',
    summary: 'The Indian rupee appreciated for the third consecutive session on FII inflows.',
    source: 'ET Markets',
    time: '2h ago',
    sector: 'markets',
    cluster: 'Markets Today',
    thumbnail: 'https://images.unsplash.com/photo-1526303328184-975967522da6?auto=format&fit=crop&q=80&w=400',
    fullContent: `
      Mumbai: The Indian rupee appreciated for the third consecutive session on strong FII inflows and positive domestic data. The unit strengthened to 82.4 against the US dollar.
      
      Currency traders noted that robust corporate dollar sales and a softening dollar index globally contributed to the rupee’s strength.
      
      Experts project the rupee to remain in a tight range with an upside bias, supported by the RBI’s healthy foreign exchange reserves which recently crossed $640 billion.
    `,
    readTime: '2 min',
    isBreaking: false,
  },
  {
    id: 8,
    title: 'Tata Motors EV Sales Jump 85% in February, Nexon EV Leads Charge',
    summary: 'Tata Motors dominates the EV space with Nexon EV capturing 62% market share.',
    source: 'ET Auto',
    time: '7h ago',
    sector: 'auto',
    cluster: 'Auto & Mobility',
    thumbnail: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=400',
    fullContent: `
      Mumbai: Tata Motors posted explosive EV sales growth in February 2026, reporting 85% year-on-year increase with 18,500 units sold. The Nexon EV continues to dominate with 62% market share in the passenger EV segment.
      
      Tata is additionally planning to launch the Harrier EV and Sierra EV by Q2 FY27, with expected combined monthly sales of 6,000 units. The company’s charging infrastructure JV, Tata.ev, now has 6,200 fast chargers across 520 cities.
      
      However, margin pressure persists as battery costs remain high despite PLI subsidies. The overall passenger vehicle volumes for the company also saw a healthy 12% growth.
    `,
    readTime: '4 min',
    isBreaking: false,
  },
  {
    id: 9,
    title: 'Reliance Green Energy Arm Plans ₹75,000 Cr Investment in Solar Manufacturing',
    summary: 'Reliance doubles down on renewable energy with massive solar cell factory plans.',
    source: 'ET Energy',
    time: '8h ago',
    sector: 'energy',
    cluster: 'Energy & Power',
    thumbnail: 'https://images.unsplash.com/photo-1509391366360-fe5bb58583bb?auto=format&fit=crop&q=80&w=400',
    fullContent: `
      Mumbai: Reliance Retail Ventures Ltd acquired a 60% controlling stake in homegrown premium fashion brand House of Anita Dongre for an undisclosed sum estimated at Rs 1,400 crore.
      
      The acquisition gives Reliance a strong foothold in India’s Rs 7.5 lakh crore organized fashion market. The brand operates 300+ stores across India with a strong NRI diaspora customer base.
      
      This is part of Reliance Retail strategy to build a portfolio of aspirational, domestically-made fashion brands to compete with the influx of global fast-fashion retailers. The deal is expected to close pending CCI approval.
    `,
    readTime: '5 min',
    isBreaking: false,
  },
  {
    id: 10,
    title: 'Crude Oil Slides Below $75 on Demand Concerns, Indian Basket Eases',
    summary: 'Brent crude dropped 2.3% amid weakening global demand, positive for Indian markets.',
    source: 'ET Markets',
    time: '3h ago',
    sector: 'energy',
    cluster: 'Markets Today',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400',
    fullContent: `
      London: Brent crude dropped 2.3% dropping below $75 a barrel amid weakening global demand expectations and a build-up in US inventories.
      
      The slump in prices is a major positive for oil-importing countries like India, reducing the import bill and helping keep domestic inflation in check.
      
      The Indian basket of crude oil also eased proportionally, providing relief to domestic oil marketing companies (OMCs) like IOC, BPCL, and HPCL, whose marketing margins are expected to improve further into the next quarter.
    `,
    readTime: '3 min',
    isBreaking: false,
  },
  {
    id: 11,
    title: 'ITC FMCG Margins Expand to 12%; Aashirvaad, Bingo Drive Growth',
    summary: 'ITC\'s FMCG division turns profitable with margin expansion for the 5th quarter.',
    source: 'ET Retail',
    time: '9h ago',
    sector: 'fmcg',
    cluster: 'FMCG & Consumer',
    thumbnail: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&q=80&w=400',
    fullContent: `
      Kolkata: ITC Ltd surpassed Hindustan Unilever to become India’s largest FMCG company by market capitalization, crossing Rs 5.8 lakh crore on the back of strong branded packaged goods growth.
      
      ITC’s FMCG segment revenues grew 19% YoY in Q3FY26 driven by the Aashirvaad, Sunfeast and YiPPee! brands. Margins also expanded to 12% marking the fifth consecutive quarter of margin improvement.
      
      The hotel business, recently demerged as ITC Hotels, listed separately and trades at a premium. Analysts are bullish citing ITC pricing power and a distribution moat of 6 million retail touchpoints.
    `,
    readTime: '3 min',
    isBreaking: false,
  },
  {
    id: 12,
    title: 'DLF Launches Ultra-Luxury Project in Gurugram, Prices Start at ₹7 Cr',
    summary: 'DLF targets HNI buyers with its premium residential project in Sector 63.',
    source: 'ET Realty',
    time: '10h ago',
    sector: 'realestate',
    cluster: 'Real Estate',
    thumbnail: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&q=80&w=400',
    fullContent: `
      Gurugram: DLF Ltd sold all 795 ultra-luxury apartments in its new Dahlias Phase 2 project in Gurugram within 72 hours of launch, clocking Rs 5,590 crore in sales at Rs 6-8 crore per flat.
      
      This marks the fastest sell-out for any residential project in India’s history. The project targets HNIs and NRIs and comes with dedicated concierge, private pools, and EV charging for every unit.
      
      DLF total residential sales in FY26 already stand at Rs 17,000 crore, well above its full-year guidance of Rs 15,000 crore. Real estate analysts cite India growing ultra-HNI population as the driving force.
    `,
    readTime: '3 min',
    isBreaking: false,
  },
  {
    id: 13,
    title: 'Steel Prices Rally 5% on China Stimulus Hopes, Tata Steel Gains',
    summary: 'China\'s potential infrastructure package lifts global steel demand outlook.',
    source: 'ET Markets',
    time: '4h ago',
    sector: 'metals',
    cluster: 'Metals & Mining',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=400',
    fullContent: `
      New Delhi: Global steel prices rallied over 5% on expectations of a massive infrastructure stimulus package from China to revive its real estate sector.
      
      Domestic steel majors including Tata Steel, JSW Steel, and SAIL saw their stock prices jump between 3% to 5% as traders expect the Chinese stimulus to boost global commodity demand.
      
      Industry voices suggest that Indian export margins could improve significantly if the price rally sustains over the next two quarters.
    `,
    readTime: '3 min',
    isBreaking: false,
  },
  {
    id: 14,
    title: 'Budget 2026: Govt May Cut Income Tax for Middle Class, Sources Say',
    summary: 'Finance Ministry considering raising basic exemption limit to ₹5 lakh.',
    source: 'ET Now',
    time: '5h ago',
    sector: 'markets',
    cluster: 'Markets Today',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=400',
    fullContent: `
      New Delhi: Sources in the Finance Ministry say the government is strongly considering raising the basic income tax exemption limit from Rs 3 lakh to Rs 5 lakh under the new tax regime in Union Budget 2026.
      
      This move would benefit over 3 crore individual taxpayers and is aimed at boosting middle-class consumption ahead of four state elections. The revenue foregone would be approximately Rs 55,000 crore.
      
      Separately, the government is also exploring scrapping LTCG on equity investments up to Rs 2 lakh annually to encourage retail participation in capital markets.
    `,
    readTime: '6 min',
    isBreaking: true,
  },
  {
    id: 15,
    title: 'Cipla Partners with Moderna for mRNA Vaccine Distribution in India',
    summary: 'The partnership aims to bring next-gen vaccines to India by Q4 FY26.',
    source: 'ET Health',
    time: '6h ago',
    sector: 'pharma',
    cluster: 'Pharma & Health',
    thumbnail: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=400',
    fullContent: `
      Mumbai: Cipla Ltd announced a strategic partnership with global biotech firm Moderna to distribute its mRNA vaccines across India and neighboring markets.
      
      The tie-up aims to bring next-generation vaccines for respiratory illnesses and certain oncology targets to India by Q4 FY26.
      
      This collaboration strengthens Cipla’s specialty pipeline and gives Moderna an established distribution network reaching practically every pharmacy in the subcontinent.
    `,
    readTime: '4 min',
    isBreaking: false,
  },
  {
    id: 16,
    title: 'Wipro Announces AI-First Strategy, Plans to Hire 3,000 AI Engineers',
    summary: 'Wipro pivots to AI with a dedicated business unit and aggressive hiring plans.',
    source: 'ET Tech',
    time: '8h ago',
    sector: 'it',
    cluster: 'IT & Tech',
    thumbnail: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=400',
    fullContent: `
      Bengaluru: Wipro announced a comprehensive AI-first strategy, committing $1 Billion over the next three years to build out its artificial intelligence capabilities.
      
      The IT major plans to hire 3,000 dedicated AI engineers and upskill its entire workforce of 250,000 employees. The company formed a new business unit, Wipro ai360, dedicated to enterprise AI adoption.
      
      CEO Thierry Delaporte emphasized that AI will now be seamlessly integrated into every solution offered to clients, from cloud transformations to cybersecurity.
    `,
    readTime: '4 min',
    isBreaking: false,
  },
  {
    id: 17,
    title: 'Gold Hits Record ₹72,000/10g as Global Uncertainty Drives Safe Haven Demand',
    summary: 'Gold prices continue to rally on geopolitical tensions and a weakening US dollar.',
    source: 'ET Markets',
    time: '1h ago',
    sector: 'metals',
    cluster: 'Markets Today',
    thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400',
    fullContent: `
      Mumbai: Gold prices hit a new lifetime high of Rs 72,000 per 10 grams in the domestic market, mirroring the global rally driven by safe-haven demand.
      
      Rising geopolitical tensions in the Middle East and speculations of a delayed interest rate cut by the US Federal Reserve contributed to the spike.
      
      Retail jewelry demand remains robust despite the high prices, driven by the ongoing wedding season in India, while central banks globally continue to accumulate gold reserves.
    `,
    readTime: '3 min',
    isBreaking: true,
  },
  {
    id: 18,
    title: 'Bajaj Auto\'s Chetak EV Crosses 1 Lakh Sales Milestone',
    summary: 'Bajaj celebrates the Chetak EV milestone with plans for 2 new electric models.',
    source: 'ET Auto',
    time: '11h ago',
    sector: 'auto',
    cluster: 'Auto & Mobility',
    thumbnail: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&q=80&w=400',
    fullContent: `
      Pune: Bajaj Auto celebrated a major milestone as its Chetak electric scooter crossed 1 lakh units in cumulative sales since its re-launch.
      
      The company is aggressively expanding its EV portfolio and announced plans to introduce two new electric models tailored for urban commuters by the end of this year.
      
      Bajaj is also actively expanding its dedicated Chetak dealer network to 150 cities, directly challenging incumbents like Ola Electric, TVS, and Ather in the rapidly growing premium e-scooter space.
    `,
    readTime: '3 min',
    isBreaking: false,
  },
];

export const marketIndices = [
  { id: 'sensex', name: 'SENSEX', value: '73,428', change: '+902.15', percent: '+1.24%', status: 'up', sparkline: [40, 45, 42, 48, 46, 52, 50, 58, 55, 62] },
  { id: 'nifty', name: 'NIFTY 50', value: '22,217', change: '+258.40', percent: '+1.18%', status: 'up', sparkline: [35, 38, 36, 42, 40, 45, 44, 48, 47, 52] },
  { id: 'banknifty', name: 'BANK NIFTY', value: '47,832', change: '+869.20', percent: '+1.85%', status: 'up', sparkline: [20, 25, 22, 30, 28, 35, 33, 42, 40, 50] },
  { id: 'it', name: 'NIFTY IT', value: '38,150', change: '+950.00', percent: '+2.55%', status: 'up', sparkline: [50, 55, 52, 60, 58, 65, 63, 72, 70, 80] },
];

export const sectorPerformance = [
  { 
    id: 'it', name: 'IT', weight: 2, topMover: 'Infosys +2.6%', 
    data1D: { change: '+2.47%', status: 'up', strength: 85 },
    data1W: { change: '+5.12%', status: 'up', strength: 70 },
    data1M: { change: '+8.40%', status: 'up', strength: 90 },
    stocks: [
      { symbol: 'INFY', name: 'Infosys', price: '1,487', change: '+4.2%', sparkline: [40, 42, 45, 48, 47, 52, 50, 58, 55, 62] },
      { symbol: 'TCS', name: 'TCS', price: '4,120', change: '+2.5%', sparkline: [30, 32, 35, 38, 36, 42, 40, 48, 45, 52] },
      { symbol: 'WIPRO', name: 'Wipro', price: '482', change: '+1.8%', sparkline: [20, 22, 25, 28, 26, 30, 28, 35, 32, 40] },
      { symbol: 'HCLTECH', name: 'HCL Tech', price: '1,540', change: '+1.5%', sparkline: [10, 12, 15, 18, 16, 20, 18, 25, 22, 30] },
    ]
  },
  { 
    id: 'banking', name: 'Banking', weight: 2, topMover: 'HDFC +2.1%', 
    data1D: { change: '+1.86%', status: 'up', strength: 75 },
    data1W: { change: '+2.45%', status: 'up', strength: 60 },
    data1M: { change: '+4.10%', status: 'up', strength: 80 },
    stocks: [
      { symbol: 'HDFCBANK', name: 'HDFC Bank', price: '1,642', change: '+2.1%', sparkline: [35, 38, 36, 42, 40, 45, 44, 48, 47, 52] },
      { symbol: 'ICICIBANK', name: 'ICICI Bank', price: '1,085', change: '+1.7%', sparkline: [25, 28, 26, 32, 30, 35, 34, 38, 37, 42] },
      { symbol: 'SBIN', name: 'SBI', price: '762', change: '+1.4%', sparkline: [15, 18, 16, 22, 20, 25, 24, 28, 27, 32] },
      { symbol: 'KOTAKBANK', name: 'Kotak Bank', price: '1,745', change: '+1.1%', sparkline: [5, 8, 6, 12, 10, 15, 14, 18, 17, 22] },
    ]
  },
  { 
    id: 'auto', name: 'Auto', weight: 1, topMover: 'Tata Motors +2.4%', 
    data1D: { change: '+1.39%', status: 'up', strength: 65 },
    data1W: { change: '-1.12%', status: 'down', strength: 40 },
    data1M: { change: '+2.40%', status: 'up', strength: 55 },
    stocks: [
      { symbol: 'TATAMOTORS', name: 'Tata Motors', price: '985', change: '+2.4%', sparkline: [40, 42, 45, 48, 47, 52, 50, 58, 55, 62] },
      { symbol: 'M&M', name: 'M&M', price: '1,842', change: '+1.9%', sparkline: [30, 32, 35, 38, 36, 42, 40, 48, 45, 52] },
      { symbol: 'MARUTI', name: 'Maruti', price: '11,450', change: '+1.2%', sparkline: [20, 22, 25, 28, 26, 30, 28, 35, 32, 40] },
      { symbol: 'BAJAJ-AUTO', name: 'Bajaj Auto', price: '8,340', change: '+0.8%', sparkline: [10, 12, 15, 18, 16, 20, 18, 25, 22, 30] },
    ]
  },
  { 
    id: 'pharma', name: 'Pharma', weight: 1, topMover: 'Sun +1.1%', 
    data1D: { change: '-0.34%', status: 'down', strength: 30 },
    data1W: { change: '+1.12%', status: 'up', strength: 50 },
    data1M: { change: '-2.40%', status: 'down', strength: 20 },
    stocks: [
      { symbol: 'SUNPHARMA', name: 'Sun Pharma', price: '1,540', change: '-1.8%', sparkline: [62, 55, 58, 50, 52, 47, 48, 45, 42, 40] },
      { symbol: 'CIPLA', name: 'Cipla', price: '1,342', change: '-1.2%', sparkline: [52, 45, 48, 40, 42, 36, 38, 35, 32, 30] },
      { symbol: 'DRREDDY', name: 'Dr Reddys', price: '6,240', change: '-0.9%', sparkline: [42, 35, 38, 30, 32, 26, 28, 25, 22, 20] },
      { symbol: 'DIVISLAB', name: 'Divis Lab', price: '3,542', change: '-0.5%', sparkline: [32, 25, 28, 20, 22, 16, 18, 15, 12, 10] },
    ]
  },
  { 
    id: 'fmcg', name: 'FMCG', weight: 1, topMover: 'HUL +0.3%', 
    data1D: { change: '0.00%', status: 'flat', strength: 50 },
    data1W: { change: '+0.15%', status: 'up', strength: 52 },
    data1M: { change: '-0.85%', status: 'down', strength: 45 },
    stocks: [
      { symbol: 'HUL', name: 'HUL', price: '2,442', change: '+0.3%', sparkline: [40, 40, 41, 40, 40, 41, 40, 41, 40, 40] },
      { symbol: 'ITC', name: 'ITC', price: '425', change: '+0.1%', sparkline: [40, 40, 41, 40, 40, 41, 40, 41, 40, 40] },
      { symbol: 'NESTLEIND', name: 'Nestle', price: '2,540', change: '-0.1%', sparkline: [40, 40, 39, 40, 40, 39, 40, 39, 40, 40] },
      { symbol: 'BRITANNIA', name: 'Britannia', price: '4,842', change: '-0.2%', sparkline: [40, 40, 39, 40, 40, 39, 40, 39, 40, 40] },
    ]
  },
  { 
    id: 'energy', name: 'Energy', weight: 1, topMover: 'ONGC -0.8%', 
    data1D: { change: '-0.12%', status: 'down', strength: 48 },
    data1W: { change: '+1.45%', status: 'up', strength: 65 },
    data1M: { change: '+3.10%', status: 'up', strength: 75 },
    stocks: [
      { symbol: 'ONGC', name: 'ONGC', price: '272', change: '-0.8%', sparkline: [48, 47, 48, 46, 47, 45, 46, 44, 45, 43] },
      { symbol: 'RELIANCE', name: 'Reliance', price: '2,945', change: '+0.5%', sparkline: [40, 41, 40, 42, 41, 43, 42, 44, 43, 45] },
      { symbol: 'BPCL', name: 'BPCL', price: '642', change: '-0.3%', sparkline: [40, 39, 40, 38, 39, 37, 38, 36, 37, 35] },
      { symbol: 'IOC', name: 'IOC', price: '172', change: '-0.4%', sparkline: [40, 39, 40, 38, 39, 37, 38, 36, 37, 35] },
    ]
  },
  { 
    id: 'realestate', name: 'Real Estate', weight: 1, topMover: 'DLF -2.1%', 
    data1D: { change: '-1.15%', status: 'down', strength: 25 },
    data1W: { change: '+4.45%', status: 'up', strength: 85 },
    data1M: { change: '+12.10%', status: 'up', strength: 95 },
    stocks: [
      { symbol: 'DLF', name: 'DLF', price: '842', change: '-2.1%', sparkline: [50, 48, 45, 42, 40, 35, 30, 25, 20, 15] },
      { symbol: 'GODREJPROP', name: 'Godrej Prop', price: '2,342', change: '+1.5%', sparkline: [35, 38, 42, 45, 48, 52, 55, 60, 65, 70] },
    ]
  },
  { 
    id: 'infra', name: 'Infrastructure', weight: 1, topMover: 'L&T +1.8%', 
    data1D: { change: '+1.20%', status: 'up', strength: 70 },
    data1W: { change: '+2.10%', status: 'up', strength: 75 },
    data1M: { change: '+5.40%', status: 'up', strength: 80 },
    stocks: [
      { symbol: 'LT', name: 'L&T', price: '3,450', change: '+1.8%', sparkline: [40, 42, 45, 48, 47, 52, 50, 58, 55, 62] },
    ]
  },
  { 
    id: 'metals', name: 'Metals', weight: 1, topMover: 'Tata Steel +2.2%', 
    data1D: { change: '+1.45%', status: 'up', strength: 75 },
    data1W: { change: '+3.12%', status: 'up', strength: 65 },
    data1M: { change: '+6.40%', status: 'up', strength: 85 },
    stocks: [
      { symbol: 'TATASTEEL', name: 'Tata Steel', price: '142', change: '+2.2%', sparkline: [30, 32, 35, 38, 36, 42, 40, 48, 45, 52] },
    ]
  },
  { 
    id: 'logistics', name: 'Logistics', weight: 1, topMover: 'Adani Port +1.5%', 
    data1D: { change: '+0.85%', status: 'up', strength: 60 },
    data1W: { change: '+1.45%', status: 'up', strength: 55 },
    data1M: { change: '+2.10%', status: 'up', strength: 65 },
    stocks: [
      { symbol: 'ADANIPORTS', name: 'Adani Ports', price: '1,240', change: '+1.5%', sparkline: [20, 22, 25, 28, 26, 30, 28, 35, 32, 40] },
    ]
  },
];

export const topGainers = [
  { symbol: 'INFY', name: 'Infosys', price: '1,487', change: '+4.2%', status: 'up' },
  { symbol: 'RELIANCE', name: 'Reliance', price: '2,945', change: '+2.8%', status: 'up' },
  { symbol: 'TCS', name: 'TCS', price: '4,120', change: '+2.5%', status: 'up' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', price: '1,642', change: '+1.9%', status: 'up' },
];

export const topLosers = [
  { symbol: 'SUNPHARMA', name: 'Sun Pharma', price: '1,540', change: '-1.8%', status: 'down' },
  { symbol: 'MARUTI', name: 'Maruti', price: '11,450', change: '-1.2%', status: 'down' },
  { symbol: 'ONGC', name: 'ONGC', price: '272', change: '-0.9%', status: 'down' },
  { symbol: 'COALINDIA', name: 'Coal India', price: '445', change: '-0.5%', status: 'down' },
];

export const trendingAssets = [
  { symbol: 'ZOMATO', name: 'Zomato', reason: 'Strong Q3 results', volume: 'high' },
  { symbol: 'ADANIENT', name: 'Adani Ent', reason: 'Fresh project win', volume: 'very high' },
  { symbol: 'TATASTEEL', name: 'Tata Steel', reason: 'Commodity price rally', volume: 'moderate' },
];

export const mockBriefing = {
  tldr: 'RBI maintained the repo rate at 6.5% for the 8th consecutive policy meeting, signaling cautious optimism about India\'s growth trajectory while keeping inflation vigilance.',
  whyItMatters: 'As a banking sector investor, this directly impacts your holdings. Stable rates mean continued lending growth for HDFC Bank and other banks in your portfolio. NIMs may compress slightly but credit growth remains robust at 16% YoY.',
  marketImpact: 'Banking stocks rallied 1.5% post-announcement. Nifty Bank is up 350 points. Bond yields softened to 7.05%. Rate-sensitive sectors like Real Estate and Auto also gained. FIIs are likely to continue buying given the policy stability.',
  whatToWatch: [
    'Next MPC meeting on April 9 — potential for rate cut if inflation stays below 5%',
    'Q4 earnings of HDFC Bank (April 20) and ICICI Bank (April 22)',
    'US Fed decision on March 29 — could influence FII flows',
    'Credit growth data from RBI — next release March 31',
  ],
  relatedArticles: [
    { title: 'HDFC Bank Q3 Beats Estimates', id: 2 },
    { title: 'Sensex Rallies on FII Buying', id: 6 },
    { title: 'Rupee Strengthens on Inflows', id: 7 },
  ],
};
