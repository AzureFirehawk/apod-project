import { normalizeText } from "./apodKeyword.mjs";

const NASA_API_KEY = "W83Z1iSs1HJ7Al5lifeGgTaON1wZVCHiOJ49GyU6";
const APOD_URL = "https://api.nasa.gov/planetary/apod";

export async function loadTopicKeywords(topicLabel) {
    const res = await fetch("./data/searchTopics.json");
    const topics = await res.json();
    const topic = topics.find(t => t.label.toLowerCase() === topicLabel.toLowerCase());
    return topic ? topic.keywords.map(k => k.toLowerCase()) : [];
}

function keywordInText(text, keyword) {
    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // escape regex chars
    const regex = new RegExp(`\\b${escapedKeyword}\\b`, 'i'); // match whole words/phrases
    return regex.test(text);
}

function apodMatchScore(apod, keywords) {
    const title = normalizeText(apod.title || "");
    const explanation = normalizeText(apod.explanation || "");

    // Prioritize longer phrases first
    keywords = keywords.slice().sort((a, b) => b.length - a.length);

    let score = 0;
    const titleWeight = 10;
    const explanationWeight = 5;

    keywords.forEach(keyword => {
        if (keywordInText(title, keyword)) {
            score += titleWeight;
        } else if (keywordInText(explanation, keyword)) {
            score += explanationWeight;
        }
    });

    return score;
}

export async function fetchApodsInRange(startDate, endDate) {
    const url = new URL(APOD_URL);
    url.searchParams.set("api_key", NASA_API_KEY);
    url.searchParams.set("start_date", startDate);
    url.searchParams.set("end_date", endDate);

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch APOD batch: ${res.statusText}`);
    return await res.json();
}

export async function searchApodsByTopicInRange(topicLabel, startDate, endDate) {
    const keywords = await loadTopicKeywords(topicLabel);
    const apods = await fetchApodsInRange(startDate, endDate);

    const matched = apods
        .map(apod => ({ apod, score: apodMatchScore(apod, keywords) }))
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score) // descending relevance

    return matched;
}
