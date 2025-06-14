import { loadHeaderFooter } from "./utils.mjs";
import { searchApodsByTopicInRange } from "./searchByTopic.mjs";
import { createApodCard } from "./apodCard.mjs";

loadHeaderFooter();

const topicTitle = document.getElementById("topic-title");
const topicDisplay = document.getElementById("topic-display");

// Add and configure "View More" button
const viewMoreBtn = document.createElement("button");
viewMoreBtn.textContent = "View More";
viewMoreBtn.classList.add("view-more-btn");
viewMoreBtn.style.display = "none"; // hide until first load
document.querySelector("main").appendChild(viewMoreBtn);

// Constants
const APOD_START_DATE = new Date("1995-06-16");
let topicLabel = "";
let currentEndDate = new Date(); // Start from today

function getTopicFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("topic");
}

// Load batch of APODs
async function loadApodBatch() {
    const endDateStr = currentEndDate.toISOString().split("T")[0];
    const startDate = new Date(currentEndDate);
    startDate.setDate(startDate.getDate() - 90);
    const startDateStr = startDate.toISOString().split("T")[0];

    try {
        const results = await searchApodsByTopicInRange(topicLabel, startDateStr, endDateStr);

        if (results.length === 0 && topicDisplay.children.length === 0) {
            topicDisplay.innerHTML = `<p>No matches found for "${topicLabel}".</p>`;
            viewMoreBtn.style.display = "none";
            return;
        }

        // keep top scoring results
        const topResults = results.slice(0, 12);        

        topResults.forEach(({ apod, score }) => {
            const card = createApodCard(apod, {
                showExplanation: true,
                isFlippable: true,
                showRemoveButton: false
            });
        });

        // Move window back 30 days for next load
        currentEndDate.setDate(currentEndDate.getDate() - 90);

        // Stop if we're at or before June 16, 1995
        if (currentEndDate <= APOD_START_DATE) {
            viewMoreBtn.style.display = "none";
        } else {
            viewMoreBtn.style.display = "block";
        }

    } catch (err) {
        console.error(err);
        topicDisplay.innerHTML = `<p>Error loading results. Please try again later.</p>`;
    }
}

// Init and bind listener
async function initTopicSearch() {
    topicLabel = getTopicFromURL();
    if (!topicLabel) {
        topicDisplay.innerHTML = "<p>No topic provided.</p>";
        return;
    }

    topicTitle.textContent = `Results for: ${topicLabel}`;
    await loadApodBatch(); // load initial batch

    viewMoreBtn.addEventListener("click", async () => {
        viewMoreBtn.disabled = true;
        viewMoreBtn.textContent = "Loading...";
        await loadApodBatch();
        viewMoreBtn.disabled = false;
        viewMoreBtn.textContent = "View More";
    });
}

initTopicSearch();
