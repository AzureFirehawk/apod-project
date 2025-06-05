import { loadHeaderFooter, toTitleCase } from "./utils.mjs";
import { fetchApodWithKeywords } from './apodKeyword.mjs';
import { fetchWikipediaInfo } from './WikiFetch.mjs';

loadHeaderFooter();

/**
 * Fetch a Wikipedia summary and URL for a given keyword
 * @param {string} term
 * @returns {Promise<{ title: string, summary: string, url: string } | null>}
 */


/**
 * Create and insert related topic cards using Wikipedia data
 * @param {Array<string>} keywords
 */
async function showRelatedTopics(keywords) {
    const container = document.querySelector(".related-topics .cards-container");
    container.innerHTML = ""; // Clear old content

    const used = new Set();
    let count = 0;

    for (const term of keywords) {
        if (count >= 3 || used.has(term)) break;
        const wikiInfo = await fetchWikipediaInfo(term);
        if (wikiInfo) {       
            const card = document.createElement("div");
            card.classList.add("topic-card");

            card.innerHTML = `
                <h4>${toTitleCase(wikiInfo.title)}</h4>
                <p>${wikiInfo.summary}</p>
                <a href="${wikiInfo.url}" target="_blank">Read more</a>
            `;
            container.appendChild(card);
            used.add(term);
            count++;
        }
    }

    if (count === 0) {
        container.innerHTML = "<p>No related topics found.</p>";
    }   
}

/**
 * Show the APOD content and related topic cards
 */
async function showApodInfo(date) {
    try {
        const { apodData, keywords } = await fetchApodWithKeywords(date);

        // Populate APOD section
        document.getElementById("apod-title").textContent = apodData.title;
        document.getElementById("apod-explanation").textContent = apodData.explanation;
        document.getElementById("apod-image").src = apodData.url;
        document.getElementById("apod-image").alt = apodData.title;

        // Show related topic cards
        await showRelatedTopics(keywords);

    } catch (err) {
        console.error('Error loading APOD with keywords:', err);
    }
}

showApodInfo(); // fetch today’s APOD with keywords
