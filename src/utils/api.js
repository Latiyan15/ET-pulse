const API_BASE_URL = '/api';

/**
 * Retrieves the full user profile from localStorage.
 */
export const getFullProfile = () => {
  try {
    const profile = JSON.parse(localStorage.getItem('etpulse_profile') || '{}');
    const user = JSON.parse(localStorage.getItem('etpulse_user') || '{}');
    return { ...profile, name: user.name };
  } catch (e) {
    return { language: 'English' };
  }
};

/**
 * Builds a query string/params object from the full profile.
 */
export const buildProfileParams = (profileOverride = {}) => {
  const profile = { ...getFullProfile(), ...profileOverride };
  const params = new URLSearchParams();
  
  // Basic info
  params.append('user_type', profile.user_type || 'investor');
  params.append('language', profile.preferred_language || (profile.languages && profile.languages[0]) || 'English');
  
  // Arrays
  if (profile.sectors?.length > 0) params.append('sectors', profile.sectors.join(','));
  if (profile.interests?.length > 0) params.append('interests', profile.interests.join(','));
  if (profile.stocks?.length > 0) params.append('stocks', profile.stocks.join(','));
  if (profile.mf_categories?.length > 0) params.append('mf_categories', profile.mf_categories.join(','));
  if (profile.startup_sector?.length > 0) params.append('startup_sector', profile.startup_sector.join(','));
  if (profile.business_challenges?.length > 0) params.append('business_challenges', profile.business_challenges.join(','));
  if (profile.reading_reason?.length > 0) params.append('reading_reason', profile.reading_reason.join(','));

  // Scalars
  if (profile.investor_type) params.append('investor_type', profile.investor_type);
  if (profile.study_stream) params.append('study_stream', profile.study_stream);
  if (profile.startup_stage) params.append('startup_stage', profile.startup_stage);
  if (profile.news_priority) params.append('news_priority', profile.news_priority);
  if (profile.job_function) params.append('job_function', profile.job_function);
  if (profile.business_type) params.append('business_type', profile.business_type);
  
  return params;
};

/**
 * Builds a JSON body for POST requests including the full profile.
 */
export const buildProfileBody = (extraData = {}) => {
  return {
    ...getFullProfile(),
    ...extraData
  };
};

/**
 * Fetches an AI briefing for a specific topic and user type.
 */
export const getBriefing = async (topicId, userType = 'investor', options = {}) => {
  try {
    const query = buildProfileParams(options);
    if (options.mode) query.set('mode', options.mode);

    const response = await fetch(`${API_BASE_URL}/briefing/${encodeURIComponent(topicId)}?${query.toString()}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error("API Error Fetching Briefing:", error);
    throw error;
  }
};

/**
 * Fetches trending/personalized news.
 */
export const fetchTrendingNews = async (profileOverride = {}) => {
  try {
    const query = buildProfileParams(profileOverride);
    const hasFilters = query.get('sectors') || query.get('interests') || query.get('stocks');

    const url = hasFilters
      ? `${API_BASE_URL}/news/personalized?${query.toString()}`
      : `${API_BASE_URL}/news/trending`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error("API Error Fetching News:", error);
    return []; // Return empty array on error, handle locally
  }
};

/**
 * Fetches news specifically by an array of sectors or interests.
 * Always injects full profile (language, user_type, stocks, etc.) from localStorage.
 */
export const fetchNewsByFilters = async (sectors = [], interests = [], language = 'English', userType = 'reader') => {
  try {
    // Use buildProfileParams to include ALL profile data (language, stocks, etc.)
    const query = buildProfileParams({ language, user_type: userType });
    
    // Allow explicit sector/interest overrides
    if (sectors.length > 0) query.set('sectors', sectors.join(','));
    if (interests.length > 0) query.set('interests', interests.join(','));

    const url = (sectors.length > 0 || interests.length > 0)
      ? `${API_BASE_URL}/news/personalized?${query.toString()}`
      : `${API_BASE_URL}/news/trending`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Network error');
    return await response.json();
  } catch (error) {
    console.error("API Error Fetching Filtered:", error);
    return [];
  }
};

/**
 * Fetches news for a specific sector tab (e.g., Banking, IT, Pharma).
 */
export const fetchNewsBySector = async (sectorId, language = 'English') => {
  try {
    const query = new URLSearchParams();
    if (language) query.append('language', language);
    const response = await fetch(`${API_BASE_URL}/news/sector/${encodeURIComponent(sectorId)}?${query.toString()}`);
    if (!response.ok) throw new Error('Network error');
    return await response.json();
  } catch (error) {
    console.error("API Error Fetching Sector News:", error);
    return [];
  }
};

/**
 * Sends a message to the AI for a context-aware chat session.
 */
export const askQuestion = async (briefingId, message, history = [], options = {}) => {
  try {
    const body = buildProfileBody({
      briefing_id: briefingId,
      message,
      history,
      session_id: options.sessionId || 'default'
    });

    const response = await fetch(`${API_BASE_URL}/chat/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data; // Returns { answer, session_id }
  } catch (error) {
    console.error("API Error in Chat:", error);
    throw error;
  }
};

/**
 * Saves the user's onboarding profile to the database.
 */
export const saveProfile = async (profile) => {
  try {
    const response = await fetch(`${API_BASE_URL}/onboarding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error("API Error Saving Profile:", error);
    throw error;
  }
};

/**
 * Translates content (like article titles) via AI.
 */
export const translateContent = async (content, language, userType = 'reader') => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, language, user_type: userType })
    });
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.result || content;
  } catch (error) {
    console.error("API Error Translating:", error);
    return content;
  }
};
