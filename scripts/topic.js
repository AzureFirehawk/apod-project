import { loadHeaderFooter } from "./utils.mjs";
import { searchApodsByTopicInRange } from "./searchByTopic.mjs";

loadHeaderFooter();

function getTopicFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("topic") || "";
}
