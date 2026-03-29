const fs = require('fs');
const filepath = 'c:/Users/Riya Thakur/Downloads/etriya/src/utils/i18n.js';
let content = fs.readFileSync(filepath, 'utf8');

// Replacements for each language for 'feed.understand'
content = content.replace(/'feed\.understand': 'Understand in 30s',/g, "'feed.analyze': 'Analyze with AI',");
content = content.replace(/'feed\.understand': '30 सेकंड में समझें',/g, "'feed.analyze': 'AI के साथ विश्लेषण करें',");
content = content.replace(/'feed\.understand': '30 வினாடிகளில் புரிந்து கொள்ளுங்கள்',/g, "'feed.analyze': 'AI உடன் பகுப்பாய்வு செய்யுங்கள்',");
content = content.replace(/'feed\.understand': '30 సెకన్లలో అర్థం చేసుకోండి',/g, "'feed.analyze': 'AI తో విశ్లేషించండి',");
content = content.replace(/'feed\.understand': '30 সেকেন্ডের মধ্যে বুঝুন',/g, "'feed.analyze': 'AI এর সাথে বিশ্লেষণ করুন',");
content = content.replace(/'feed\.understand': '३० सेकंदात समजून घ्या',/g, "'feed.analyze': 'AI सह विश्लेषण करा',");

// Add sector translations to 'en'
content = content.replace(/('feed\.title': 'Latest Updates for You',)/, 
`'sector.banking': 'Banking',
    'sector.it': 'IT',
    'sector.pharma': 'Pharma',
    'sector.auto': 'Auto',
    'sector.fmcg': 'FMCG',
    'sector.energy': 'Energy',
    'sector.realestate': 'Real Estate',
    'sector.metals': 'Metals',
    'sector.markets': 'Markets',
    $1`);

// Add sector translations to 'hi'
content = content.replace(/('feed\.title': 'आपके लिए नवीनतम अपडेट',)/, 
`'sector.banking': 'बैंकिंग',
    'sector.it': 'आईटी',
    'sector.pharma': 'फार्मा',
    'sector.auto': 'ऑटो',
    'sector.fmcg': 'एफएमसीजी',
    'sector.energy': 'ऊर्जा',
    'sector.realestate': 'रियल एस्टेट',
    'sector.metals': 'धातु',
    'sector.markets': 'बाज़ार',
    $1`);

// Add sector translations to 'ta'
content = content.replace(/('feed\.title': 'உங்களுக்கான சமீபத்திய புதுப்பிப்புகள்',)/, 
`'sector.banking': 'வங்கியியல்',
    'sector.it': 'ஐடி',
    'sector.pharma': 'பார்மா',
    'sector.auto': 'ஆட்டோ',
    'sector.fmcg': 'FMCG',
    'sector.energy': 'ஆற்றல்',
    'sector.realestate': 'ரியல் எஸ்டேட்',
    'sector.metals': 'உலோகங்கள்',
    'sector.markets': 'சந்தைகள்',
    $1`);

// Add sector translations to 'te'
content = content.replace(/('feed\.title': 'మీ కోసం తాజా అప్‌డేట్‌లు',)/, 
`'sector.banking': 'బ్యాంకింగ్',
    'sector.it': 'ఐటీ',
    'sector.pharma': 'ఫార్మా',
    'sector.auto': 'ఆటో',
    'sector.fmcg': 'FMCG',
    'sector.energy': 'శక్తి',
    'sector.realestate': 'రియల్ ఎస్టేట్',
    'sector.metals': 'లోహాలు',
    'sector.markets': 'మార్కెట్లు',
    $1`);

// Add sector translations to 'bn'
content = content.replace(/('feed\.title': 'আপনার জন্য সর্বশেষ আপডেট',)/, 
`'sector.banking': 'ব্যাংকিং',
    'sector.it': 'আইটি',
    'sector.pharma': 'ফার্মা',
    'sector.auto': 'অটো',
    'sector.fmcg': 'FMCG',
    'sector.energy': 'শক্তি',
    'sector.realestate': 'রিয়েল এস্টেট',
    'sector.metals': 'ধাতু',
    'sector.markets': 'বাজার',
    $1`);

// Add sector translations to 'mr'
content = content.replace(/('feed\.title': 'तुमच्यासाठी नवीनतम अपडेट्स',)/, 
`'sector.banking': 'बँकिंग',
    'sector.it': 'आयटी',
    'sector.pharma': 'फार्मा',
    'sector.auto': 'ऑटो',
    'sector.fmcg': 'FMCG',
    'sector.energy': 'ऊर्जा',
    'sector.realestate': 'रिअल इस्टेट',
    'sector.metals': 'धातू',
    'sector.markets': 'बाजार',
    $1`);

fs.writeFileSync(filepath, content);
console.log('i18n.js updated successfully');
