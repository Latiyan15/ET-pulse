const axios = require('axios');
require('dotenv').config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'google/gemini-2.0-flash-001';

/**
 * Calls OpenRouter with Gemini Flash model.
 */
async function callOpenRouter(messages, jsonMode = false) {
  try {
    console.log(`🤖 AI Request: ${MODEL} | JSON: ${jsonMode}`);
    if (!OPENROUTER_API_KEY) {
      console.error('❌ Missing OPENROUTER_API_KEY in process.env');
      throw new Error('API Key Missing');
    }

    const response = await axios.post(
      OPENROUTER_BASE_URL,
      {
        model: MODEL,
        messages,
        ...(jsonMode ? { response_format: { type: 'json_object' } } : {})
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5173',
          'X-Title': 'ET Pulse'
        },
        timeout: 30000
      }
    );
    console.log('✅ AI Response Received');
    return response.data.choices[0].message.content;
  } catch (error) {
    if (error.response) {
      console.error(`❌ OpenRouter Error ${error.response.status}:`, JSON.stringify(error.response.data));
    } else {
      console.error('❌ OpenRouter Error:', error.message);
    }
    throw error;
  }
}

/**
 * Build persona description for prompts.
 */
function getPersonaContext(userType, sectors = [], interests = []) {
  const tones = {
    investor: 'analytical and data-driven, focused on portfolio impact, ROI, market trends and stock performance',
    student: 'educational and simple, using analogies, defining complex terms, relevant to exams and learning',
    founder: 'strategic and actionable, focused on funding, regulation, market opportunities and startup ecosystem',
    professional: 'professional and technical, with institutional depth, regulatory detail and market mechanics',
    business_owner: 'practical and business-focused, emphasizing cost impact, regulation changes, loan rates, GST',
    reader: 'conversational and simple, explaining how news affects everyday life in plain language'
  };

  const sectorStr = sectors.length > 0 ? sectors.join(', ') : 'general markets';
  const interestStr = interests.length > 0 ? interests.slice(0, 4).join(', ') : 'general finance';

  return {
    tone: tones[userType] || tones.reader,
    sectorStr,
    interestStr
  };
}

/**
 * Generates a structured financial briefing using Gemini via OpenRouter.
 */
async function generateBriefing(articles, userType, options = {}) {
  try {
    const targetLang = options.language || 'English';
    const sectors = options.sectors || [];
    const interests = options.interests || [];
    const { tone, sectorStr, interestStr } = getPersonaContext(userType, sectors, interests);

    const isDeepDive = options.mode === 'deep';
    const isSingleArticle = articles.length === 1;

    let prompt;

    if (isDeepDive && isSingleArticle) {
      // === ARTICLE-SPECIFIC DEEP ANALYSIS ===
      const article = articles[0];
      prompt = `You are an elite financial journalist and strategist for "ET Pulse", an AI-powered Indian news app.

TASK: Perform a COMPREHENSIVE, ARTICLE-SPECIFIC deep-dive analysis of the following news article.
This MUST be completely unique to THIS specific article — do NOT give generic market commentary.

ARTICLE TO ANALYZE:
Title: "${article.title}"
Source: ${article.source}
Content: ${article.content}

READER PROFILE:
- Type: ${userType}
- Understanding of sectors: ${sectorStr}
- Areas of interest: ${interestStr}
- Language preference: ${targetLang}

ANALYSIS REQUIREMENTS:
1. Your entire response must be about THIS SPECIFIC ARTICLE — not general markets
2. Write in ${targetLang}
3. Tone: ${tone}
4. Include: real-world impact examples, historical parallels if relevant, sectoral implications
5. The "personalized_take" must advise the ${userType} specifically on THIS story
6. "suggested_questions" must be directly about THIS article's topic

Return a JSON object with this EXACT schema (no markdown, raw JSON only):
{
  "title": "A specific, compelling headline about the article's topic in ${targetLang}",
  "tldr": ["4-6 bullet points with specific facts from THIS article in ${targetLang}"],
  "themes": ["3 core themes directly from this article in ${targetLang}"],
  "sector_highlights": ["2-3 precise observations about the sector directly from this article's content in ${targetLang}"],
  "impact": {
    "winners": ["2-3 specific entities/companies that benefit from THIS news, with clear reasoning in ${targetLang}"],
    "losers": ["2-3 specific entities/sectors that face headwinds from THIS news, with reasoning in ${targetLang}"]
  },
  "simple_explanation": "2-3 sentence layman's explanation of what THIS specific news means in ${targetLang}",
  "personalized_take": "A detailed paragraph (5-7 sentences) specifically telling a ${userType} what action or awareness THIS specific story demands. Be concrete and specific to the article content. In ${targetLang}.",
  "suggested_questions": ["3 follow-up questions that arise naturally from THIS specific article in ${targetLang}"],
  "source_count": 1,
  "reading_time": "3 min"
}`;
    } else {
      // === SECTOR/TOPIC FLASH BRIEFING (multiple articles) ===
      prompt = `You are an expert financial news analyst for "ET Pulse", an AI-powered Indian news app.

Aggregate the following news articles into a single cohesive AI Briefing.

USER PROFILE:
- Type: ${userType}
- Sectors of interest: ${sectorStr}
- Topics of interest: ${interestStr}
- Language: ${targetLang}

TONE REQUIREMENTS:
- Be ${tone}
- Write the ENTIRE response in ${targetLang}

ARTICLES:
${JSON.stringify(articles.slice(0, 6))}

Return a JSON object matching this EXACT schema (no markdown, raw JSON):
{
  "title": "A compelling headline in ${targetLang}",
  "tldr": ["3-5 concise bullet points summarizing key facts in ${targetLang}"],
  "themes": ["3 core themes/keywords in ${targetLang}"],
  "sector_highlights": ["2-3 specific headlines or major changes observed in the primary sector in ${targetLang}"],
  "impact": {
    "winners": ["2-3 entities/sectors that benefit, with brief reason in ${targetLang}"],
    "losers": ["2-3 entities/sectors at risk, with brief reason in ${targetLang}"]
  },
  "simple_explanation": "1-2 sentence plain-language summary of the big picture in ${targetLang}",
  "personalized_take": "One paragraph of analysis specifically tailored for a ${userType} — what this means for them, what action or attention to give it. In ${targetLang}.",
  "suggested_questions": ["3 smart follow-up questions a ${userType} would ask in ${targetLang}"],
  "source_count": ${articles.length},
  "reading_time": "2 min"
}`;
    }

    const content = await callOpenRouter([
      { role: 'user', content: prompt }
    ], true);

    let jsonStr = content.trim();
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    } else if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```\n?/, '').replace(/\n?```$/, '');
    }

    // Parse the JSON from the response
    const parsed = JSON.parse(jsonStr.trim());
    return parsed;

  } catch (error) {
    console.error('Gemini/OpenRouter Generation Error:', error.message);
    const article = articles[0];
    return {
      title: article ? `Analysis: ${article.title}` : 'Market Update — AI Briefing',
      tldr: ['Analysis is being prepared...', 'Please try again in a moment.'],
      themes: ['Markets', 'Economy', 'Investment'],
      sector_highlights: ['Data is being retrieved from financial sources.'],
      impact: {
        winners: ['To be determined after analysis'],
        losers: ['To be determined after analysis']
      },
      simple_explanation: article?.content?.substring(0, 200) || 'Markets are reacting to global and domestic economic signals today.',
      personalized_take: 'Stay updated with the latest developments relevant to your portfolio and interests.',
      suggested_questions: [
        `What are the key implications of "${article?.title || 'this news'}"?`,
        'Which sectors are most affected?',
        'What should investors watch out for?'
      ],
      source_count: articles.length,
      reading_time: '2 min'
    };
  }
}

/**
 * Answers follow-up questions with full conversation context.
 */
async function askAI(briefingJson, history, question, options = {}) {
  try {
    const targetLang = options.language || 'English';
    const userType = options.userType || 'investor';
    const sectors = options.sectors || [];
    const interests = options.interests || [];
    const { tone } = getPersonaContext(userType, sectors, interests);

    const systemPrompt = `You are the ET Pulse AI Assistant — a highly professional and analytical financial companion.

USER PROFILE:
- Type: ${userType}
- Sectors: ${sectors.join(', ') || 'general financial markets'}
- Interests: ${interests.slice(0, 3).join(', ') || 'broad finance and investment'}

PROTOCOL:
1. TONE: Professional, expert, and engaging. Be authoritative but avoid being robotic or overly stiff. 
2. STRUCTURE: Ensure the response is "properly framed" using Markdown. Use bullet points for structured data, bold text for critical terms, and clearly separated paragraphs for readability.
3. CONTENT: Provide sophisticated, data-driven insights. Explain complex financial mechanisms with precision.
4. LANGUAGE: Respond exclusively in ${targetLang}.
5. CONTEXT: If briefing context is provided, integrate it seamlessly into your analysis.
6. AVOID: Do not use casual fillers like "Okay," "I'd be happy to," or "Here is." NEVER use phrases like "keeping it simple" or "exam-friendly." Focus on providing a structured, expert analysis.

${briefingJson && Object.keys(briefingJson).length > 0 ? `BRIEFING CONTEXT:\n${JSON.stringify(briefingJson)}` : ''}`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.map(h => ({
        role: h.role === 'user' ? 'user' : 'assistant',
        content: h.content
      })),
      { role: 'user', content: question }
    ];

    const answer = await callOpenRouter(messages, false);
    return answer;

  } catch (error) {
    if (error.response) {
      console.error(`❌ OpenRouter Chat Error ${error.response.status}:`, JSON.stringify(error.response.data));
    } else {
      console.error('❌ OpenRouter Chat Error:', error.message);
    }
    return "I'm having a bit of trouble connecting right now. Please try again in a moment.";
  }
}

/**
 * Reconstructs a full news story from a short snippet/headline.
 * Used for GNews articles where full content is not available in free tier.
 */
async function reconstructArticle(title, snippet, language = 'English', userType = 'investor') {
  try {
    const { tone } = getPersonaContext(userType);
    const prompt = `You are a lead financial correspondent for ET Pulse. 
    Using the headline and snippet provided, reconstruct a detailed, high-quality, and multi-paragraph news report (3-5 paragraphs).
    
    HEADLINE: "${title}"
    SNIPPET: "${snippet}"
    USER LANGUAGE: ${language}
    USER TYPE: ${userType} (write in a tone that is ${tone})
    
    REQUIREMENTS:
    1. Expand the story with logical financial context, market implications, and potential next steps.
    2. Maintain professional journalistic standards.
    3. Do NOT make up specific names or quotes not in the snippet, but use general industry terminology.
    4. Write the ENTIRE report in ${language}.
    5. Return ONLY the reconstructed text, no titles or metadata.`;

    const result = await callOpenRouter([{ role: 'user', content: prompt }]);
    return result.trim();
  } catch (error) {
    console.error('Article Reconstruction Error:', error.message);
    return snippet; // Fallback to snippet
  }
}

/**
 * Direct translation/simplification service.
 */
async function translateContent(content, targetLang, userType) {
  try {
    const { tone } = getPersonaContext(userType);
    const prompt = `Translate and transform the following financial content into ${targetLang}.

User type: ${userType} (be ${tone})
Content: "${content}"

Requirements:
1. Natural, contextually accurate translation (not literal word-by-word)
2. Adapt style to the user type
3. Return ONLY the translated text, no extra commentary`;

    const result = await callOpenRouter([{ role: 'user', content: prompt }]);
    return result.trim();
  } catch (error) {
    console.error('Translation Error:', error.message);
    return content;
  }
}

/**
 * Batch translates an array of article objects into a target language.
 */
async function translateArticleList(articles, targetLang) {
  if (!articles || articles.length === 0) return [];

  try {
    const prompt = `You are a professional financial translator. 
Translate the 'title' and 'content' of the following JSON array of news articles into ${targetLang}.
Maintain the exact same JSON structure, array length, and object keys (id, title, source, content, url, image, etc).
Only translate the values for 'title' and 'content'. Leave 'source', 'url', and 'image' unchanged.

ARTICLES:
${JSON.stringify(articles)}

RETURN ONLY VALID JSON MATCHING THE INPUT STRUCTURE.`;

    const responseText = await callOpenRouter([{ role: 'user', content: prompt }], true);
    return JSON.parse(responseText.trim());
  } catch (error) {
    console.error(`Article List Translation Error to ${targetLang}:`, error.message);
    return articles; // Fallback to original
  }
}

module.exports = {
  generateBriefing,
  askAI,
  translateContent,
  translateArticleList,
  reconstructArticle
};
