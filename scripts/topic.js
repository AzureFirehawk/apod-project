import { loadHeaderFooter } from "./utils.mjs";
import { searchApodsByTopicInRange } from "./searchByTopic.mjs";

loadHeaderFooter();

function getTopicFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("topic") || "";
}

function formatDate(date) {
    return new Date(date).toISOString().split("T")[0];
};

function getDateRange(daysBack = 7) {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - daysBack);
    return {
        start: formatDate(start),
        end: formatDate(end)
    };
}

function createApodCard(apod) {
    const card = document.createElement("div");
    card.classList.add("apod-card");

}