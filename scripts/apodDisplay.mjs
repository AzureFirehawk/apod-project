import { fetchApodWithKeywords } from "./apodKeyword.mjs";
import { fetchWikipediaInfo } from "./WikiFetch.mjs";
import { toTitleCase } from "./utils.mjs";
import { updateFavoriteButton } from "./FavoritesUI.mjs";


//Create and insert related topic cards using Wikipedia data
export async function showRelatedTopics(keywords) {
    const container = document.querySelector(".related-topics .cards-container");
    container.innerHTML = ""; // Clear old content

    const used = new Set();
    let count = 0;

    for (const term of keywords) {
        if (count >= 3 || used.has(term)) break;
        const wikiInfo = await fetchWikipediaInfo(term.keyword);
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

//Show the APOD content and related topic cards

export async function showApodInfo(date) {
    try {
        const { apodData, keywords } = await fetchApodWithKeywords(date);
        console.log(apodData);
        // Populate APOD section
        document.getElementById("apod-title").textContent = apodData.title;
        document.getElementById("apod-explanation").textContent = apodData.explanation;

        const mediaContainer = document.getElementById("apod-media");
        mediaContainer.innerHTML = ""; // Clear previous content

        if (apodData.media_type === "image") {
            const img = document.createElement("img");
            img.src = apodData.url;
            img.alt = apodData.title;
            img.loading = "lazy";
            mediaContainer.appendChild(img);
        } else if (apodData.media_type === "video") {
            const iframe = document.createElement("iframe");
            iframe.src = apodData.url;
            iframe.allowFullscreen = true;
            iframe.frameBorder = "0";
            iframe.loading = "lazy";
            iframe.width = "100%";
            iframe.height = "500"; // Adjust height as needed
            mediaContainer.appendChild(iframe);
        } else {
            mediaContainer.innerHTML = `<p>Unsupported media type: ${apodData.media_type}</p>`;
        }
        // Update favorite button
        updateFavoriteButton(apodData);

        // Show related topic cards
        await showRelatedTopics(keywords);
    return apodData
    } catch (err) {
        console.error('Error loading APOD with keywords:', err);
    }


}