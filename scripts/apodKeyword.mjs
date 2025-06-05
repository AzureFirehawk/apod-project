// apodKeyword.mjs

const NASA_API_KEY = 'W83Z1iSs1HJ7Al5lifeGgTaON1wZVCHiOJ49GyU6';
const APOD_URL = 'https://api.nasa.gov/planetary/apod';
const IMAGE_LIBRARY_URL = 'https://images-api.nasa.gov/search';

/**
 * Fetch APOD data from NASA API
 */
export async function fetchApod(date) {
    try {
        const url = new URL(APOD_URL);
        url.searchParams.append('api_key', NASA_API_KEY);
        if (date) url.searchParams.append('date', date);

        const res = await fetch(url);
        if (!res.ok) throw new Error(`APOD API error: ${res.status} ${res.statusText}`);
        return await res.json();
    } catch (error) {
        console.error('Error fetching APOD:', error);
        throw error;
    }
}

/**
 * Search NASA Image and Video Library API by title (query)
 */
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

// 🔭 Astronomy terms & phrases
const astronomyTerms = new Set([
    'planet', 'mars', 'venus', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto', 'moon', 'lunar', 'dwarf',
    'star', 'supernova', 'nova', 'pulsar', 'quasar', 'blackhole', 'black hole', 'neutron', 'white dwarf', 'binary', 'red giant',
    'galaxy', 'andromeda', 'milky way', 'cosmos', 'universe', 'cluster', 'nebula', 'nebulae', 'dark matter',
    'asteroid', 'comet', 'meteor', 'meteorite', 'meteoroid', 'satellite', 'spacecraft', 'probe', 'rocket', 'capsule',
    'eclipse', 'transit', 'aurora', 'magnetosphere', 'magnetic field', 'radiation', 'gravity', 'gravitational wave', 'gravitational lensing', 'cosmic ray', 'big bang', 'expansion', 'star trails',
    'telescope', 'observatory', 'spectroscope', 'spectrometer', 'infrared', 'x-ray', 'radio', 'detector', 'camera', 'lens', 'filter',
    'orbit', 'rotation', 'revolution', 'velocity', 'acceleration', 'mass', 'density', 'temperature', 'light year', 'parsec', 'spectrum', 'wavelength', 'frequency', 'energy', 'plasma', 'magnetism', 'field',
    'atmosphere', 'vacuum', 'solar', 'heliosphere', 'interstellar', 'intergalactic', 'space', 'cosmic', 'skyscape', 'star map',
    'apollo', 'hubble', 'cassini', 'voyager', 'spitzer', 'james webb', 'iss', 'international space station',
    'constellation', 'zenith', 'horizon', 'equinox', 'solstice', 'parallax', 'redshift', 'blueshift', 'spectra', 'celestial',
    'phenomena', 'apparent', 'magnitude', 'luminosity', 'exoplanet', 'cosmology', 'astrophysics', 'astrobiology', 'startrails', 'polaris',
]);

const astronomyPhrases = [
    'black hole', 'white dwarf', 'neutron star', 'solar system', 'milky way',
    'andromeda galaxy', 'supernova explosion', 'gamma ray burst', 'lunar eclipse',
    'solar eclipse', 'comet tail', 'light year', 'cosmic microwave background',
    'hubble space telescope', 'dark matter', 'dark energy', 'gravitational wave',
    'planetary nebula', 'event horizon', 'interstellar medium', 'star cluster',
    'spiral galaxy', 'elliptical galaxy', 'quasar', 'exoplanet', 'pulsar',
    'aurora borealis', 'equatorial orbit', 'circumpolar star', 'celestial pole',
];

// 🔠 Normalize and clean text for matching
function normalizeText(text) {
    return text
        .toLowerCase()
        .replace(/[\.,;:"'()\-]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

// 🧠 Match phrases inside normalized text
function extractPhrasesFromText(text, phraseList) {
    const normalized = normalizeText(text);
    return phraseList.filter(phrase => normalized.includes(phrase));
}

// 🧪 Match single astronomy terms
function extractRelevantKeywords(text) {
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

    return [...new Set(words.filter(word => astronomyTerms.has(word)))];
}

/**
 * Fetch APOD + match keywords and phrases
 */
export async function fetchApodWithKeywords(date) {
    const apodData = await fetchApod(date);

    const phraseKeywords = extractPhrasesFromText(apodData.explanation, astronomyPhrases);
    const termKeywords = extractRelevantKeywords(apodData.explanation);

    const imageLibraryItems = await searchImageLibraryByTitle(apodData.title);
    const imageKeywords = (imageLibraryItems[0]?.data[0]?.keywords || []).map(k => k.toLowerCase());

    const combinedKeywords = [...new Set([
        ...phraseKeywords,
        ...termKeywords,
        ...imageKeywords
    ])];

    return { apodData, keywords: combinedKeywords };
}
