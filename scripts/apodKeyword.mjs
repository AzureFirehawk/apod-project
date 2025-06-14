// apodKeyword.mjs

let astronomyTerms = new Set();
let astronomyPhrases = [];

async function loadAstronomyKeywords() {
    try {
        const res = await fetch('./data/astronomyKeywords.json');
        const json = await res.json();
        astronomyTerms = new Set(json.terms.map(term => term.toLowerCase()));
        astronomyPhrases = json.phrases.map(p => p.toLowerCase());
    } catch (err) {
        console.error("Failed to load astronomy keywords:", err);
    }
}
const NASA_API_KEY = 'W83Z1iSs1HJ7Al5lifeGgTaON1wZVCHiOJ49GyU6';
const APOD_URL = 'https://api.nasa.gov/planetary/apod';
const IMAGE_LIBRARY_URL = 'https://images-api.nasa.gov/search';

//Fetch APOD data from NASA API
export async function fetchApod(date) {
    try {
        const url = new URL(APOD_URL);
        url.searchParams.append('api_key', NASA_API_KEY);
        if (date) url.searchParams.append('date', date);

        const res = await fetch(url);
        if (!res.ok) throw new Error(`APOD API error: ${res.status} ${res.statusText}`);
        console.log('APOD API response:', res);
        return await res.json();
    } catch (error) {
        console.error('Error fetching APOD:', error);
        throw error;
    }
}

//Search NASA Image and Video Library API by title
export async function searchImageLibraryByTitle(title) {
    try {
        const url = new URL(IMAGE_LIBRARY_URL);
        url.searchParams.append('q', title);
        url.searchParams.append('media_type', 'image');

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Image Library API error: ${res.status} ${res.statusText}`);
        const data = await res.json();

        console.log(data.collection.items);
        return data.collection.items || [];
    } catch (error) {
        console.error('Error searching NASA Image Library:', error);
        return [];
    }
}

// Normalize and clean text for matching
export function normalizeText(text) {
    return text
        .toLowerCase()
        .replace(/[\.,;:"'()\-]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

// Match phrases inside normalized text
function extractPhrasesFromText(text, phraseList) {
    const normalized = normalizeText(text);
    return phraseList
        .filter(phrase => normalized.includes(phrase))
        .map(phrase => ({ keyword: phrase, score: 2 })); // Phrase score
}

// Match single astronomy terms
function extractRelevantKeywords(text, source='body') {
    if (!text) return [];

    const stopwords = new Set([
        'which', 'their', 'there', 'about', 'would', 'these', 'could',
        'other', 'some', 'also', 'after', 'before', 'where', 'when',
        'what', 'from', 'that', 'this', 'with', 'have', 'your', 'than',
        'then', 'were', 'been', 'more', 'most', 'very', 'such', 'into',
        'they', 'them', 'who', 'his', 'her', 'him', 'our', 'out', 'now',
        'get', 'all', 'any', 'but', 'not', 'for', 'and', 'the', 'are', 'was', 'you', 'one'
    ]);

    const words = text
        .toLowerCase()
        .split(/\W+/)
        .filter(word => word.length > 4 && !stopwords.has(word));

    const score = source === 'title' ? 3 : 1.5;

    return [...new Set(words)]
        .filter(word => astronomyTerms.has(word))
        .map(word => ({ keyword: word, score }));
}

//Fetch APOD + match keywords and phrases
export async function fetchApodWithKeywords(date) {
    const apodData = await fetchApod(date);
    await loadAstronomyKeywords();

    const titleKeywords = extractRelevantKeywords(apodData.title, 'title');
    const phraseKeywords = extractPhrasesFromText(apodData.explanation, astronomyPhrases);
    const termKeywords = extractRelevantKeywords(apodData.explanation, 'body');

    const imageLibraryItems = await searchImageLibraryByTitle(apodData.title);
    const imageKeywordsRaw = (imageLibraryItems[0]?.data[0]?.keywords || []).map(k => k.toLowerCase());
    const imageKeywordScores = imageKeywordsRaw
        .filter(k => astronomyTerms.has(k) || astronomyPhrases.includes(k))
        .map(k => ({ keyword: k, score: 2 }));
    
    const allKeywords = [
        ...titleKeywords,
        ...phraseKeywords,
        ...termKeywords,
        ...imageKeywordScores
    ];

    // Merge by keyword and sum scores
    const keywordMap = new Map();
    for (const { keyword, score } of allKeywords) {
        const normalized = normalizeText(keyword);
        if (keywordMap.has(keyword)) {
            keywordMap.set(keyword, keywordMap.get(keyword) + score);
        } else {
            keywordMap.set(keyword, score);
        }
    }

    // Sorted keyword-score pairs
    const scoredKeywords = [...keywordMap.entries()]
        .map(([keyword, score]) => ({ keyword, score }))
        .sort((a, b) => b.score - a.score);

    console.log(`Keywords for ${apodData.title}:`, scoredKeywords);
    return {
        apodData,
        firstTitleKeywords: titleKeywords.length ? titleKeywords[0].keyword : null,
        keywords: scoredKeywords
    };

}
